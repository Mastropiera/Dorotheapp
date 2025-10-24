"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ScaleCardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Info, Download, FileText, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const assistSchema = z.object({
  q1_everUsed: z.string({ required_error: "Seleccione una opción." }),
  q2_freqLast3Months: z.string().optional(),
  q3_freqCraving: z.string().optional(),
  q4_freqProblems: z.string().optional(),
  q5_freqFailedExpectations: z.string().optional(),
  q6_concernFromOthers: z.string().optional(),
  q7_failedCutDown: z.string().optional(),
  q8_everInjected: z.string().optional(),
});

type AssistFormValues = z.infer<typeof assistSchema>;

interface AssistResult {
  patientName: string;
  substance: string;
  score: number;
  interpretation: string;
  riskLevel: 'Bajo' | 'Moderado' | 'Alto';
  date: string;
  responses: Record<string, string>;
  recommendations: string[];
}

const substanceGroups = [
  { value: "a", label: "a. Tabaco (cigarrillos, puros, rapé)" },
  { value: "b", label: "b. Bebidas alcohólicas (cerveza, vino, licores)" },
  { value: "c", label: "c. Cannabis (marihuana, hachís, hierba)" },
  { value: "d", label: "d. Cocaína (coca, crack, pasta base)" },
  { value: "e", label: "e. Estimulantes tipo anfetamina (éxtasis, metanfetamina)" },
  { value: "f", label: "f. Inhalantes (pegamento, disolventes, bencina)" },
  { value: "g", label: "g. Sedantes o pastillas para dormir (benzodiacepinas)" },
  { value: "h", label: "h. Alucinógenos (LSD, hongos, ketamina)" },
  { value: "i", label: "i. Opioides (heroína, morfina, tramadol, codeína)" },
  { value: "j", label: "j. Otras sustancias (especificar)" },
];

const scoringOptions: Record<string, { label: string; score: number }[]> = {
  q2: [
    { label: "Nunca", score: 0 },
    { label: "Una o dos veces", score: 2 },
    { label: "Mensualmente", score: 3 },
    { label: "Semanalmente", score: 4 },
    { label: "A diario o casi a diario", score: 6 },
  ],
  q3: [
    { label: "Nunca", score: 0 },
    { label: "Una o dos veces", score: 3 },
    { label: "Mensualmente", score: 4 },
    { label: "Semanalmente", score: 5 },
    { label: "A diario o casi a diario", score: 6 },
  ],
  q4: [
    { label: "Nunca", score: 0 },
    { label: "Una o dos veces", score: 4 },
    { label: "Mensualmente", score: 5 },
    { label: "Semanalmente", score: 6 },
    { label: "A diario o casi a diario", score: 7 },
  ],
  q5: [
    { label: "Nunca", score: 0 },
    { label: "Una o dos veces", score: 5 },
    { label: "Mensualmente", score: 6 },
    { label: "Semanalmente", score: 7 },
    { label: "A diario o casi a diario", score: 8 },
  ],
  q6: [
    { label: "No, nunca", score: 0 },
    { label: "Sí, en los últimos 3 meses", score: 3 },
    { label: "Sí, pero no en los últimos 3 meses", score: 0 },
  ],
  q7: [
    { label: "No, nunca", score: 0 },
    { label: "Sí, en los últimos 3 meses", score: 3 },
    { label: "Sí, pero no en los últimos 3 meses", score: 0 },
  ],
  q8: [
    { label: "No, nunca", score: 0 },
    { label: "Sí, en los últimos 3 meses", score: 1 },
    { label: "Sí, pero no en los últimos 3 meses", score: 0 },
  ],
};

const questionLabels: Record<string, string> = {
    q1: "¿Ha consumido esta sustancia alguna vez en su vida? (Uso no médico)",
    q2: "En los últimos 3 meses, ¿con qué frecuencia ha consumido esta sustancia?",
    q3: "En los últimos 3 meses, ¿con qué frecuencia ha sentido un fuerte deseo o ansia de consumir?",
    q4: "En los últimos 3 meses, ¿con qué frecuencia su consumo le ha causado problemas de salud, sociales, legales o económicos?",
    q5: "En los últimos 3 meses, ¿con qué frecuencia no pudo hacer lo que se esperaba de usted debido a su consumo?",
    q6: "Un familiar o amigo, ¿alguna vez ha mostrado preocupación por su consumo?",
    q7: "¿Ha intentado alguna vez reducir o dejar de consumir y no ha podido?",
    q8: "¿Alguna vez ha consumido alguna droga por vía inyectada? (Solo uso no médico)",
};

// Recomendaciones específicas por nivel de riesgo y sustancia
const getRecommendations = (riskLevel: string, substance: string, score: number): string[] => {
  const baseRecommendations: Record<string, string[]> = {
    'Bajo': [
      "Continúe con patrones de consumo responsables",
      "Manténgase informado sobre los riesgos asociados",
      "Considere revisiones periódicas de su consumo"
    ],
    'Moderado': [
      "Se recomienda reducir la frecuencia de consumo",
      "Busque actividades alternativas saludables",
      "Considere apoyo profesional o grupos de ayuda",
      "Monitoree los efectos en su vida diaria",
      "Establezca límites claros de consumo"
    ],
    'Alto': [
      "Se recomienda encarecidamente buscar ayuda profesional especializada",
      "Considere un programa de tratamiento estructurado",
      "Evalúe la necesidad de desintoxicación médica supervisada",
      "Busque apoyo familiar y social",
      "Desarrolle un plan de prevención de recaídas"
    ]
  };

  let recommendations = [...baseRecommendations[riskLevel] || []];

  // Recomendaciones específicas por sustancia
  if (substance === 'b' && riskLevel !== 'Bajo') { // Alcohol
    recommendations.push("Considere períodos de abstinencia completa");
    if (score > 15) recommendations.push("Evalúe riesgos de síndrome de abstinencia");
  } else if (substance === 'a') { // Tabaco
    recommendations.push("Explore opciones de reemplazo de nicotina");
    recommendations.push("Considere terapia conductual para dejar de fumar");
  } else if (['d', 'e', 'h', 'i'].includes(substance)) { // Sustancias de mayor riesgo
    recommendations.push("Evaluación médica inmediata recomendada");
    recommendations.push("Considere hospitalización si es necesario");
  }

  return recommendations;
};

const ASSISTForm: React.FC = () => {
    const [selectedSubstance, setSelectedSubstance] = useState<string | null>(null);
    const [specificScore, setSpecificScore] = useState<number | null>(null);
    const [interpretation, setInterpretation] = useState<string>("");
    const [patientName, setPatientName] = useState('');
    const [otherSubstance, setOtherSubstance] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [currentResult, setCurrentResult] = useState<AssistResult | null>(null);
    const [evaluationHistory, setEvaluationHistory] = useState<AssistResult[]>([]);
    const [riskLevel, setRiskLevel] = useState<'Bajo' | 'Moderado' | 'Alto' | null>(null);
    
    const { toast } = useToast();

    const form = useForm<AssistFormValues>({
        resolver: zodResolver(assistSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (selectedSubstance) {
            form.reset({});
            setSpecificScore(null);
            setInterpretation("");
            setRiskLevel(null);
            setCurrentResult(null);
        }
    }, [selectedSubstance, form]);
    
    const calculateRiskLevel = (score: number, substanceType: string): 'Bajo' | 'Moderado' | 'Alto' => {
      if (substanceType === 'b') { // Alcohol
        if (score <= 10) return 'Bajo';
        if (score <= 26) return 'Moderado';
        return 'Alto';
      } else { // Otras sustancias
        if (score <= 3) return 'Bajo';
        if (score <= 26) return 'Moderado';
        return 'Alto';
      }
    };

    const onSubmit = (data: AssistFormValues) => {
        if (data.q1_everUsed === "no") {
            const result: AssistResult = {
              patientName: patientName || 'Sin especificar',
              substance: substanceGroups.find(sg => sg.value === selectedSubstance)?.label || 'Sustancia no especificada',
              score: 0,
              interpretation: "No hay consumo reportado para esta sustancia.",
              riskLevel: 'Bajo',
              date: new Date().toLocaleString('es-ES'),
              responses: { q1_everUsed: 'No' },
              recommendations: ["No se requieren intervenciones específicas", "Mantener estilo de vida saludable", "Educación preventiva sobre riesgos"]
            };
            
            setSpecificScore(0);
            setInterpretation(result.interpretation);
            setRiskLevel('Bajo');
            setCurrentResult(result);
            return;
        }

        // Validar que todas las preguntas requeridas estén respondidas
        const requiredFields = ['q2_freqLast3Months', 'q3_freqCraving', 'q4_freqProblems', 'q5_freqFailedExpectations', 'q6_concernFromOthers', 'q7_failedCutDown'];
        const missingFields = requiredFields.filter(field => !data[field as keyof AssistFormValues]);
        
        if (missingFields.length > 0) {
          toast({
            title: "Campos incompletos",
            description: "Por favor complete todas las preguntas antes de calcular el riesgo.",
            variant: "destructive"
          });
          return;
        }

        const scoreQ2 = scoringOptions.q2[parseInt(data.q2_freqLast3Months || '0')].score;
        const scoreQ3 = scoringOptions.q3[parseInt(data.q3_freqCraving || '0')].score;
        const scoreQ4 = scoringOptions.q4[parseInt(data.q4_freqProblems || '0')].score;
        const scoreQ5 = scoringOptions.q5[parseInt(data.q5_freqFailedExpectations || '0')].score;
        const scoreQ6 = scoringOptions.q6[parseInt(data.q6_concernFromOthers || '0')].score;
        const scoreQ7 = scoringOptions.q7[parseInt(data.q7_failedCutDown || '0')].score;
        const scoreQ8 = data.q8_everInjected ? scoringOptions.q8[parseInt(data.q8_everInjected || '0')].score : 0;

        const totalScore = scoreQ2 + scoreQ3 + scoreQ4 + scoreQ5 + scoreQ6 + scoreQ7 + scoreQ8;
        const calculatedRiskLevel = calculateRiskLevel(totalScore, selectedSubstance || '');
        
        let interpretationText = "";
        if (selectedSubstance === 'b') { // Alcohol
            if (totalScore <= 10) interpretationText = "Bajo Riesgo. Intervención: Feedback breve.";
            else if (totalScore <= 26) interpretationText = "Riesgo Moderado. Intervención: Consejería breve.";
            else interpretationText = "Alto Riesgo. Intervención: Tratamiento más intensivo.";
        } else { // Otras sustancias
            if (totalScore <= 3) interpretationText = "Bajo Riesgo. Intervención: Feedback breve.";
            else if (totalScore <= 26) interpretationText = "Riesgo Moderado. Intervención: Consejería breve.";
            else interpretationText = "Alto Riesgo. Intervención: Tratamiento más intensivo.";
        }

        // Crear objeto de respuestas más legible
        const responses: Record<string, string> = {
          'Consumo previo': data.q1_everUsed === 'yes' ? 'Sí' : 'No',
          'Frecuencia últimos 3 meses': scoringOptions.q2[parseInt(data.q2_freqLast3Months || '0')].label,
          'Frecuencia de ansia': scoringOptions.q3[parseInt(data.q3_freqCraving || '0')].label,
          'Problemas por consumo': scoringOptions.q4[parseInt(data.q4_freqProblems || '0')].label,
          'Falló expectativas': scoringOptions.q5[parseInt(data.q5_freqFailedExpectations || '0')].label,
          'Preocupación de otros': scoringOptions.q6[parseInt(data.q6_concernFromOthers || '0')].label,
          'Intentos de reducir': scoringOptions.q7[parseInt(data.q7_failedCutDown || '0')].label,
        };

        if (data.q8_everInjected) {
          responses['Consumo inyectado'] = scoringOptions.q8[parseInt(data.q8_everInjected)].label;
        }

        const result: AssistResult = {
          patientName: patientName || 'Sin especificar',
          substance: substanceGroups.find(sg => sg.value === selectedSubstance)?.label || 'Sustancia no especificada',
          score: totalScore,
          interpretation: interpretationText,
          riskLevel: calculatedRiskLevel,
          date: new Date().toLocaleString('es-ES'),
          responses,
          recommendations: getRecommendations(calculatedRiskLevel, selectedSubstance || '', totalScore)
        };

        setSpecificScore(totalScore);
        setInterpretation(interpretationText);
        setRiskLevel(calculatedRiskLevel);
        setCurrentResult(result);
        
        toast({
          title: "Evaluación completada",
          description: `Riesgo ${calculatedRiskLevel.toLowerCase()} detectado (${totalScore} puntos)`,
        });
    };

    const saveToHistory = () => {
      if (currentResult) {
        setEvaluationHistory(prev => [currentResult, ...prev]);
        toast({
          title: "Evaluación guardada",
          description: "La evaluación se ha añadido al historial."
        });
      }
    };

    const exportToPDF = () => {
      if (!currentResult) return;
      
      // Crear contenido del reporte
      let reportContent = `REPORTE DE EVALUACIÓN ASSIST\n`;
      reportContent += `=====================================\n\n`;
      reportContent += `Fecha: ${currentResult.date}\n`;
      reportContent += `Paciente: ${currentResult.patientName}\n`;
      reportContent += `Sustancia evaluada: ${currentResult.substance}\n\n`;
      reportContent += `RESULTADO\n`;
      reportContent += `---------\n`;
      reportContent += `Puntaje total: ${currentResult.score} puntos\n`;
      reportContent += `Nivel de riesgo: ${currentResult.riskLevel.toUpperCase()}\n`;
      reportContent += `Interpretación: ${currentResult.interpretation}\n\n`;
      reportContent += `RESPUESTAS DETALLADAS\n`;
      reportContent += `--------------------\n`;
      Object.entries(currentResult.responses).forEach(([key, value]) => {
        reportContent += `${key}: ${value}\n`;
      });
      reportContent += `\nRECOMENDACIONES\n`;
      reportContent += `--------------\n`;
      currentResult.recommendations.forEach((rec, idx) => {
        reportContent += `${idx + 1}. ${rec}\n`;
      });
      
      if (clinicalNotes.trim()) {
        reportContent += `\nNOTAS CLÍNICAS\n`;
        reportContent += `-------------\n`;
        reportContent += clinicalNotes;
      }

      // Crear y descargar archivo
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ASSIST_${currentResult.patientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Reporte exportado",
        description: "El reporte se ha descargado correctamente."
      });
    };
    
    const resetCalculator = () => {
        form.reset();
        setSelectedSubstance(null);
        setSpecificScore(null);
        setInterpretation("");
        setRiskLevel(null);
        setPatientName("");
        setOtherSubstance("");
        setClinicalNotes("");
        setCurrentResult(null);
        
        toast({
          title: "Formulario reiniciado",
          description: "Todos los campos han sido limpiados."
        });
    };

    const q1Used = form.watch("q1_everUsed") === "yes";

    const getRiskBadgeColor = (risk: string) => {
      switch(risk) {
        case 'Bajo': return 'bg-green-100 text-green-800 border-green-200';
        case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-6 w-6 text-green-500" />
                  Cuestionario ASSIST
                  {riskLevel && (
                    <Badge className={`ml-auto ${getRiskBadgeColor(riskLevel)}`}>
                      Riesgo {riskLevel}
                    </Badge>
                  )}
                </CardTitle>
                <ScaleCardDescription>
                    Herramienta de cribado de consumo de sustancias de la OMS. Seleccione una sustancia y complete el cuestionario para evaluar el riesgo.
                </ScaleCardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="patientNameAssist">Nombre del Paciente (Opcional)</Label>
                        <Input 
                          id="patientNameAssist" 
                          value={patientName} 
                          onChange={(e) => setPatientName(e.target.value)} 
                          placeholder="Ingrese el nombre del paciente..." 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="clinicalNotes">Notas Clínicas (Opcional)</Label>
                        <Textarea
                          id="clinicalNotes"
                          value={clinicalNotes}
                          onChange={(e) => setClinicalNotes(e.target.value)}
                          placeholder="Observaciones adicionales, contexto clínico, etc."
                          rows={3}
                        />
                    </div>
                </div>
                
                <Separator className="my-6" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <FormLabel className="text-base font-semibold">Seleccione una sustancia para evaluar:</FormLabel>
                             <Select onValueChange={setSelectedSubstance} value={selectedSubstance || ""}>
                                <SelectTrigger><SelectValue placeholder="Seleccione una sustancia..." /></SelectTrigger>
                                <SelectContent>
                                    {substanceGroups.map(sg => (
                                      <SelectItem key={sg.value} value={sg.value}>
                                        {sg.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {selectedSubstance === 'j' && (
                              <div className="space-y-2">
                                <Label htmlFor="otherSubstance">Especifique la sustancia:</Label>
                                <Input
                                  id="otherSubstance"
                                  value={otherSubstance}
                                  onChange={(e) => setOtherSubstance(e.target.value)}
                                  placeholder="Describa la sustancia específica..."
                                />
                              </div>
                            )}
                        </div>
                        
                        {selectedSubstance && (
                            <div className="space-y-6 pt-4 border-t">
                                <FormField 
                                  control={form.control} 
                                  name="q1_everUsed" 
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="font-semibold text-base">
                                        {questionLabels.q1}
                                      </FormLabel>
                                      <RadioGroup 
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        className="flex gap-6 mt-3"
                                      >
                                        <FormItem className="flex items-center space-x-3">
                                          <FormControl>
                                            <RadioGroupItem value="yes" />
                                          </FormControl>
                                          <Label className="font-normal">Sí</Label>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3">
                                          <FormControl>
                                            <RadioGroupItem value="no" />
                                          </FormControl>
                                          <Label className="font-normal">No</Label>
                                        </FormItem>
                                      </RadioGroup>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                {q1Used && (
                                    <>
                                        {['q2', 'q3', 'q4', 'q5', 'q6', 'q7'].map(qKey => (
                                            <FormField 
                                              key={qKey} 
                                              control={form.control} 
                                              name={qKey as keyof AssistFormValues} 
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel className="font-semibold text-base">
                                                    {questionLabels[qKey]}
                                                  </FormLabel>
                                                  <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Seleccione una frecuencia..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {scoringOptions[qKey].map((opt, idx) => (
                                                        <SelectItem key={idx} value={String(idx)}>
                                                          {opt.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        ))}
                                        
                                        {selectedSubstance !== 'a' && selectedSubstance !== 'b' && selectedSubstance !== 'f' && ( // Q8 no aplica para tabaco, alcohol e inhalantes
                                            <FormField 
                                              control={form.control} 
                                              name="q8_everInjected" 
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormLabel className="font-semibold text-base">
                                                    {questionLabels.q8}
                                                  </FormLabel>
                                                  <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Seleccione una opción..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {scoringOptions.q8.map((opt, idx) => (
                                                        <SelectItem key={idx} value={String(idx)}>
                                                          {opt.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        )}
                                    </>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={resetCalculator} 
                                      className="w-full sm:w-auto"
                                    >
                                      <RotateCcw className="mr-2 h-4 w-4" />
                                      Limpiar
                                    </Button>
                                    <Button 
                                      type="submit" 
                                      className="w-full sm:w-auto" 
                                      disabled={!selectedSubstance || (q1Used && !form.formState.isValid)}
                                    >
                                      <TestTube className="mr-2 h-4 w-4" />
                                      Calcular Riesgo ASSIST
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </Form>

                {currentResult && (
                    <div className="mt-8 space-y-6">
                        <Separator />
                        
                        {/* Resultado Principal */}
                        <div className={`p-6 border-2 rounded-lg ${
                          currentResult.riskLevel === 'Alto' ? 'bg-red-50 border-red-200' :
                          currentResult.riskLevel === 'Moderado' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">
                                  Resultado para ${currentResult.substance}
                                </h3>
                                <Badge className={getRiskBadgeColor(currentResult.riskLevel)}>
                                  Riesgo {currentResult.riskLevel}
                                </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <p className="text-4xl font-extrabold text-primary mb-2">
                                      {currentResult.score} puntos
                                    </p>
                                    <p className="text-sm text-muted-foreground">Puntaje Total</p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold mb-2">Interpretación:</p>
                                    <p className="text-muted-foreground">{currentResult.interpretation}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recomendaciones */}
                        <div className="p-6 border rounded-lg bg-muted/30">
                            <h4 className="text-lg font-semibold mb-4 flex items-center">
                              <Info className="mr-2 h-5 w-5 text-blue-500" />
                              Recomendaciones Específicas
                            </h4>
                            <ul className="space-y-2">
                              {currentResult.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="text-sm">{rec}</span>
                                </li>
                              ))}
                            </ul>
                        </div>

                        {/* Detalle de Respuestas */}
                        <details className="border rounded-lg">
                            <summary className="p-4 cursor-pointer hover:bg-muted/50 font-medium">
                              Ver respuestas detalladas
                            </summary>
                            <div className="p-4 border-t bg-muted/20">
                                <div className="grid gap-3">
                                  {Object.entries(currentResult.responses).map(([question, answer]) => (
                                    <div key={question} className="flex justify-between items-start">
                                      <span className="font-medium text-sm flex-1 pr-4">{question}:</span>
                                      <span className="text-sm text-muted-foreground">{answer}</span>
                                    </div>
                                  ))}
                                </div>
                            </div>
                        </details>

                        {/* Acciones del Resultado */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button 
                              onClick={saveToHistory} 
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Guardar en Historial
                            </Button>
                            <Button 
                              onClick={exportToPDF}
                              variant="outline"
                              className="w-full sm:w-auto"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Exportar Reporte
                            </Button>
                        </div>
                    </div>
                )}

                {/* Historial de Evaluaciones */}
                {evaluationHistory.length > 0 && (
                    <div className="mt-8">
                        <Separator className="mb-6" />
                        <h3 className="text-lg font-semibold mb-4">Historial de Evaluaciones</h3>
                        <div className="space-y-3">
                            {evaluationHistory.slice(0, 5).map((evaluation, idx) => (
                                <div key={idx} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{evaluation.patientName}</p>
                                            <p className="text-sm text-muted-foreground">{evaluation.substance}</p>
                                            <p className="text-xs text-muted-foreground">{evaluation.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">{evaluation.score} pts</p>
                                            <Badge className={getRiskBadgeColor(evaluation.riskLevel)} variant="outline">
                                              {evaluation.riskLevel}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {evaluationHistory.length > 5 && (
                                <p className="text-sm text-muted-foreground text-center">
                                  ... y {evaluationHistory.length - 5} evaluaciones más
                                </p>
                            )}
                        </div>
                    </div>
                )}
                
                <Separator className="my-8" />
                
                {/* Información del Instrumento */}
                <div className="text-xs text-muted-foreground space-y-3">
                    <div className="flex items-start">
                        <Info size={16} className="mr-2 flex-shrink-0 text-blue-500 mt-0.5" />
                        <div>
                            <p className="mb-2">
                                El ASSIST (Alcohol, Smoking and Substance Involvement Screening Test) es una herramienta desarrollada por la OMS para la detección precoz y la intervención breve de problemas por consumo de sustancias.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="font-semibold mb-2">Interpretación del Puntaje Específico por Sustancia:</p>
                        <div className="grid md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="font-medium text-green-700">• Alcohol:</p>
                                <ul className="list-disc list-inside pl-4 space-y-1">
                                    <li>0-10: Bajo Riesgo (Feedback breve)</li>
                                    <li>11-26: Riesgo Moderado (Consejería breve)</li>
                                    <li>27+: Alto Riesgo (Tratamiento intensivo)</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium text-blue-700">• Otras Sustancias:</p>
                                <ul className="list-disc list-inside pl-4 space-y-1">
                                    <li>0-3: Bajo Riesgo (Feedback breve)</li>
                                    <li>4-26: Riesgo Moderado (Consejería breve)</li>
                                    <li>27+: Alto Riesgo (Tratamiento intensivo)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                        <p className="italic">
                            <strong>Fuente:</strong> WHO ASSIST Working Group (2002). The Alcohol, Smoking and Substance Involvement Screening Test (ASSIST): development, reliability and feasibility. Addiction, 97, 1183-1194.
                        </p>
                    </div>
                    
                    <div className="pt-2 border-t">
                        <p className="text-amber-700">
                            <strong>Nota Importante:</strong> Esta herramienta es para fines de cribado únicamente. Los resultados deben ser interpretados por profesionales de la salud calificados y no reemplazan una evaluación clínica completa.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ASSISTForm;
