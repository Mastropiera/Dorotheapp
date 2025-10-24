
"use client";

import React, { useState, useMemo, type FC, useCallback, useEffect, lazy } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit, PlusCircle, Search, Syringe, Trash2, User as UserIcon, BookCopy } from 'lucide-react';
import type { VademecumEntry } from '@/lib/types';
import AciclovirCard from '@/components/diluciones/farmaco-aciclovir';
import AdrenalinaCard from '@/components/diluciones/farmaco-adrenalina';
import NoradrenalinaCard from '@/components/diluciones/farmaco-noradrenalina';
import DopaminaCard from '@/components/diluciones/farmaco-dopamina';
import DobutaminaCard from '@/components/diluciones/farmaco-dobutamina';
import NitroglicerinaCard from '@/components/diluciones/farmaco-nitroglicerina';
import FentaniloCard from '@/components/diluciones/farmaco-fentanilo';
import MidazolamCard from '@/components/diluciones/farmaco-midazolam';
import AmiodaronaCard from '@/components/diluciones/farmaco-amiodarona';
import FurosemidaCard from '@/components/diluciones/farmaco-furosemida';
import HeparinaCard from '@/components/diluciones/farmaco-heparina';
import InsulinaCard from '@/components/diluciones/farmaco-insulina';
import AbciximabCard from '@/components/diluciones/farmaco-abciximab';
import AcidoTranexamicoCard from '@/components/diluciones/farmaco-acido-tranexamico';
import AcidoValproicoCard from '@/components/diluciones/farmaco-acido-valproico';
import AlbuminaCard from '@/components/diluciones/farmaco-albumina';
import AmikacinaCard from '@/components/diluciones/farmaco-amikacina';
import AminofilinaCard from '@/components/diluciones/farmaco-aminofilina';
import AmoxicilinaClavulanicoCard from '@/components/diluciones/farmaco-amoxicilina-clavulanico';
import AmpicilinaCard from '@/components/diluciones/farmaco-ampicilina';
import AmpicilinaSulbactamCard from '@/components/diluciones/farmaco-ampicilina-sulbactam';
import AnfotericinaBComplejoLipidicoCard from '@/components/diluciones/farmaco-anfotericinab-complejo-lipidico';
import AnfotericinaBDeoxicolatoCard from '@/components/diluciones/farmaco-anfotericinab-deoxicolato';
import AnidulafunginaCard from '@/components/diluciones/farmaco-anidulafungina';
import AtracurioCard from '@/components/diluciones/farmaco-atracurio';
import AtropinaCard from '@/components/diluciones/farmaco-atropina';
import BetametasonaCard from '@/components/diluciones/farmaco-betametasona';
import BicarbonatoDeSodioCard from '@/components/diluciones/farmaco-bicarbonato-sodio';
import CaspofunginaCard from '@/components/diluciones/farmaco-caspofungina';
import CefazolinaCard from '@/components/diluciones/farmaco-cefazolina';
import CefepimeCard from '@/components/diluciones/farmaco-cefepime';
import CefoperazonaSulbactamCard from '@/components/diluciones/farmaco-cefoperazona-sulbactam';
import CefotaximaCard from '@/components/diluciones/farmaco-cefotaxima';
import CeftazidimaCard from '@/components/diluciones/farmaco-ceftazidima';
import CeftriaxonaCard from '@/components/diluciones/farmaco-ceftriaxona';
import CiclofosfamidaCard from '@/components/diluciones/farmaco-ciclofosfamida';
import CiprofloxacinoCard from '@/components/diluciones/farmaco-ciprofloxacino';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import MetronidazolCard from '../diluciones/farmaco-metronidazol';
import MilrinonaCard from '../diluciones/farmaco-milrinona';
import MorfinaCard from '../diluciones/farmaco-morfina';
import NaloxonaCard from '../diluciones/farmaco-naloxona';
import NeostigminaCard from '../diluciones/farmaco-neostigmina';
import NitroprusiatoCard from '../diluciones/farmaco-nitroprusiato';
import OmeprazolCard from '../diluciones/farmaco-omeprazol';
import OndansetronCard from '../diluciones/farmaco-ondansetron';
import PapaverinaCard from '../diluciones/farmaco-papaverina';
import PenicilinaGSodicaCard from '../diluciones/farmaco-penicilina-g-sodica';
import PetidinaCard from '../diluciones/farmaco-petidina';
import PiperacilinaTazobactamCard from '../diluciones/farmaco-piperacilina-tazobactam';
import PiridoxinaCard from '../diluciones/farmaco-piridoxina';
import PotasioCloruroCard from '../diluciones/farmaco-potasio-cloruro';
import PropofolCard from '../diluciones/farmaco-propofol';
import PropranololCard from '../diluciones/farmaco-propranolol';
import ProtaminaCard from '../diluciones/farmaco-protamina';
import RanitidinaCard from '../diluciones/farmaco-ranitidina';
import RocuronioCard from '../diluciones/farmaco-rocuronio';
import SuccinilcolinaCard from '../diluciones/farmaco-succinilcolina';
import SulfatoDeMagnesioCard from '../diluciones/farmaco-sulfato-de-magnesio';
import TeicoplaninaCard from '../diluciones/farmaco-teicoplanina';
import TiopentalCard from '../diluciones/farmaco-tiopental';
import VancomicinaCard from '../diluciones/farmaco-vancomicina';
import VecuronioCard from '../diluciones/farmaco-vecuronio';
import VoriconazolCard from '../diluciones/farmaco-voriconazol';
import ClindamicinaCard from '../diluciones/farmaco-clindamicina';
import ClorfenaminaCard from '../diluciones/farmaco-clorfenamina';
import ClorpromazinaCard from '../diluciones/farmaco-clorpromazina';
import CloxacilinaCard from '../diluciones/farmaco-cloxacilina';
import ColistimetatoCard from '../diluciones/farmaco-colistimetato';
import CotrimoxazolCard from '../diluciones/farmaco-cotrimoxazol';
import DantrolenoCard from '../diluciones/farmaco-dantroleno';
import DesmopresinaCard from '../diluciones/farmaco-desmopresina';
import DexametasonaCard from '../diluciones/farmaco-dexametasona';
import DiazepamCard from '../diluciones/farmaco-diazepam';
import FenitoinaCard from '../diluciones/farmaco-fenitoina';
import FenobarbitalCard from '../diluciones/farmaco-fenobarbital';
import FenoterolCard from '../diluciones/farmaco-fenoterol';
import FluconazolCard from '../diluciones/farmaco-fluconazol';
import FlumazenilCard from '../diluciones/farmaco-flumazenil';
import GanciclovirCard from '../diluciones/farmaco-ganciclovir';
import GentamicinaCard from '../diluciones/farmaco-gentamicina';
import GluconatoDeCalcioCard from '../diluciones/farmaco-gluconato-de-calcio';
import HidrocortisonaCard from '../diluciones/farmaco-hidrocortisona';
import ImipenemCilastatinaCard from '../diluciones/farmaco-imipenem-cilastatina';
import KetoprofenoCard from '../diluciones/farmaco-ketoprofeno';
import KetorolacoCard from '../diluciones/farmaco-ketorolaco';
import LabetalolCard from '../diluciones/farmaco-labetalol';
import LCarnitinaCard from '../diluciones/farmaco-l-carnitina';
import LidocainaCard from '../diluciones/farmaco-lidocaina';
import LinezolidCard from '../diluciones/farmaco-linezolid';
import LorazepamCard from '../diluciones/farmaco-lorazepam';
import MeropenemCard from '../diluciones/farmaco-meropenem';
import MetamizolCard from '../diluciones/farmaco-metamizol';
import MetilprednisolonaCard from '../diluciones/farmaco-metilprednisolona';
const MetoclopramidaCard = lazy(() => import('../diluciones/farmaco-metoclopramida'));

const baseDrugData = [
  { name: "Abciximab", component: AbciximabCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Aciclovir", component: AciclovirCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ácido Tranexámico", component: AcidoTranexamicoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ácido Valproico", component: AcidoValproicoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Adrenalina", component: AdrenalinaCard, icon: <Syringe className="h-4 w-4 text-red-500" /> },
  { name: "Albúmina 20%", component: AlbuminaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Amikacina", component: AmikacinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Aminofilina", component: AminofilinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Amiodarona", component: AmiodaronaCard, icon: <Syringe className="h-4 w-4 text-indigo-500" /> },
  { name: "Amoxicilina + Ác. Clavulánico", component: AmoxicilinaClavulanicoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ampicilina", component: AmpicilinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ampicilina + Sulbactam", component: AmpicilinaSulbactamCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Anfotericina B (Complejo Lipídico)", component: AnfotericinaBComplejoLipidicoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Anfotericina B (Deoxicolato)", component: AnfotericinaBDeoxicolatoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Anidulafungina", component: AnidulafunginaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Atracurio", component: AtracurioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Atropina", component: AtropinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Betametasona", component: BetametasonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Bicarbonato de Sodio 8,4%", component: BicarbonatoDeSodioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Caspofungina", component: CaspofunginaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cefazolina", component: CefazolinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cefepime", component: CefepimeCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cefoperazona-Sulbactam", component: CefoperazonaSulbactamCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cefotaxima", component: CefotaximaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ceftazidima", component: CeftazidimaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ceftriaxona", component: CeftriaxonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ciclofosfamida", component: CiclofosfamidaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ciprofloxacino", component: CiprofloxacinoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Clindamicina", component: ClindamicinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Clorfenamina", component: ClorfenaminaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Clorpromazina", component: ClorpromazinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cloxacilina", component: CloxacilinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Colistimetato", component: ColistimetatoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Cotrimoxazol", component: CotrimoxazolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Dantroleno", component: DantrolenoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Desmopresina", component: DesmopresinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Dexametasona", component: DexametasonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Diazepam", component: DiazepamCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Dobutamina", component: DobutaminaCard, icon: <Syringe className="h-4 w-4 text-purple-500" /> },
  { name: "Dopamina", component: DopaminaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Fenitoína", component: FenitoinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Fenobarbital", component: FenobarbitalCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Fenoterol", component: FenoterolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Fentanilo", component: FentaniloCard, icon: <Syringe className="h-4 w-4 text-teal-500" /> },
  { name: "Fluconazol", component: FluconazolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Flumazenil", component: FlumazenilCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Furosemida", component: FurosemidaCard, icon: <Syringe className="h-4 w-4 text-lime-500" /> },
  { name: "Ganciclovir", component: GanciclovirCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Gentamicina", component: GentamicinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Gluconato de Calcio", component: GluconatoDeCalcioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Heparina Sódica", component: HeparinaCard, icon: <Syringe className="h-4 w-4 text-gray-500" /> },
  { name: "Hidrocortisona", component: HidrocortisonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Imipenem/Cilastatina", component: ImipenemCilastatinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Insulina Cristalina", component: InsulinaCard, icon: <Syringe className="h-4 w-4 text-yellow-500" /> },
  { name: "Ketoprofeno", component: KetoprofenoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ketorolaco", component: KetorolacoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "L-Carnitina", component: LCarnitinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Labetalol", component: LabetalolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Lidocaína", component: LidocainaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Linezolid", component: LinezolidCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Lorazepam", component: LorazepamCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Meropenem", component: MeropenemCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Metamizol", component: MetamizolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Metilprednisolona", component: MetilprednisolonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Metronidazol", component: MetronidazolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Midazolam", component: MidazolamCard, icon: <Syringe className="h-4 w-4 text-cyan-500" /> },
  { name: "Milrinona", component: MilrinonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Morfina", component: MorfinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Naloxona", component: NaloxonaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Neostigmina", component: NeostigminaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Nitroglicerina", component: NitroglicerinaCard, icon: <Syringe className="h-4 w-4 text-pink-500" /> },
  { name: "Nitroprusiato", component: NitroprusiatoCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Noradrenalina", component: NoradrenalinaCard, icon: <Syringe className="h-4 w-4 text-orange-500" /> },
  { name: "Omeprazol", component: OmeprazolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ondansetrón", component: OndansetronCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Papaverina", component: PapaverinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Penicilina G Sódica", component: PenicilinaGSodicaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Petidina", component: PetidinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Piperacilina-Tazobactam", component: PiperacilinaTazobactamCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Piridoxina", component: PiridoxinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Potasio Cloruro", component: PotasioCloruroCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Propofol", component: PropofolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Propranolol", component: PropranololCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Protamina", component: ProtaminaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Ranitidina", component: RanitidinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Rocuronio", component: RocuronioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Succinilcolina", component: SuccinilcolinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Sulfato de Magnesio", component: SulfatoDeMagnesioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Teicoplanina", component: TeicoplaninaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Tiopental", component: TiopentalCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Vancomicina", component: VancomicinaCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Vecuronio", component: VecuronioCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
  { name: "Voriconazol", component: VoriconazolCard, icon: <Syringe className="h-4 w-4 text-blue-500" /> },
];

const vademecumFormSchema = z.object({
  name: z.string().min(1, "El nombre del fármaco es requerido."),
  action: z.string().optional(),
  presentations: z.string().optional(),
  indications: z.string().optional(),
  contraindications: z.string().optional(),
  storage: z.string().optional(),
  reconstitution: z.string().optional(),
  dose: z.string().optional(),
  dilution: z.string().optional(),
  administration: z.string().optional(),
  solutionStability: z.string().optional(),
  administrationSpeed: z.string().optional(),
  compatibleSerums: z.string().optional(),
  ramObservations: z.string().optional(),
});
type VademecumFormValues = z.infer<typeof vademecumFormSchema>;


interface DilucionesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userVademecumEntries: VademecumEntry[];
  onAddEntry: (entry: Omit<VademecumEntry, 'id'>) => void;
  onUpdateEntry: (entry: VademecumEntry) => void;
  onDeleteEntry: (id: string) => void;
}

// Representa tanto un fármaco base como una entrada de usuario
type DrugListItem = {
    id: string;
    name: string;
    isUserEntry: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component?: React.FC<any>; 
    icon: React.ReactNode;
    entryData?: VademecumEntry; // Para las entradas de usuario
};


const DilucionesDialog: FC<DilucionesDialogProps> = ({ isOpen, onOpenChange, userVademecumEntries, onAddEntry, onUpdateEntry, onDeleteEntry }) => {
  const [view, setView] = useState<'list' | 'detail' | 'form'>("list");
  const [selectedDrug, setSelectedDrug] = useState<DrugListItem | null>(null);
  const [editingEntry, setEditingEntry] = useState<VademecumEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<VademecumEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<VademecumFormValues>({
    resolver: zodResolver(vademecumFormSchema),
    defaultValues: {},
  });
  
  const resetDialogState = useCallback(() => {
    setView("list");
    setSelectedDrug(null);
    setSearchTerm('');
    setEditingEntry(null);
    form.reset();
  }, [form]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetDialogState, 300);
    }
  }, [isOpen, resetDialogState]);

  useEffect(() => {
    if (editingEntry) {
      form.reset(editingEntry);
      setView('form');
    } else {
      form.reset({
        name: '', action: '', presentations: '', indications: '', contraindications: '',
        storage: '', reconstitution: '', dose: '', dilution: '', administration: '',
        solutionStability: '', administrationSpeed: '', compatibleSerums: '', ramObservations: ''
      });
    }
  }, [editingEntry, form]);

  const handleDrugSelect = (drug: DrugListItem) => {
    setSelectedDrug(drug);
    setView("detail");
  };

  const allDrugsList = useMemo(() => {
    const userEntries: DrugListItem[] = userVademecumEntries.map(entry => ({
      id: entry.id,
      name: entry.name,
      isUserEntry: true,
      component: undefined,
      icon: <UserIcon className="h-4 w-4 text-accent" />,
      entryData: entry,
    }));
    const baseEntries: DrugListItem[] = baseDrugData.map(d => ({ 
        id: d.name, 
        name: d.name, 
        isUserEntry: false, 
        component: d.component,
        icon: d.icon,
    }));
    return [...baseEntries, ...userEntries].sort((a, b) => a.name.localeCompare(b.name));
  }, [userVademecumEntries]);

  const filteredDrugs = useMemo(() => {
    if (!searchTerm.trim()) return allDrugsList;
    const lower = searchTerm.toLowerCase();
    return allDrugsList.filter(d => d.name.toLowerCase().includes(lower));
  }, [searchTerm, allDrugsList]);

  const handleFormSubmit = (values: VademecumFormValues) => {
    try {
      if (editingEntry) {
        onUpdateEntry({ ...editingEntry, ...values });
        toast({ title: "Fármaco actualizado", description: "La ficha se ha guardado correctamente." });
      } else {
        onAddEntry(values);
        toast({ title: "Fármaco añadido", description: `La ficha para "${values.name}" ha sido creada.` });
      }
      setView('list');
      setEditingEntry(null);
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({ title: "Error", description: "No se pudo guardar la ficha.", variant: "destructive" });
    }
  };

  const confirmDelete = (entry: VademecumEntry) => {
    setEntryToDelete(entry);
  };
  
  const executeDelete = () => {
    if (entryToDelete) {
      onDeleteEntry(entryToDelete.id);
      toast({ title: "Fármaco Eliminado", variant: "destructive" });
      setEntryToDelete(null);
      if(selectedDrug?.id === entryToDelete.id) {
          setView('list');
          setSelectedDrug(null);
      }
    }
  };


  const SelectedDrugComponent = selectedDrug?.component;

  const renderDetailSection = (title: string, content?: string) => {
    if (!content) return null;
    return (
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-primary">{title}</h4>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center text-2xl">
              {view !== 'list' && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setView('list')}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Syringe className="mr-2 h-6 w-6 text-primary" />
              Diluciones
            </DialogTitle>
            <DialogDescription>Consulta fármacos y gestiona tus propias fichas.</DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-hidden flex flex-col">
            {view === 'list' && (
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4 gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar fármaco..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <Button onClick={() => { setEditingEntry(null); setView('form'); }}><PlusCircle className="mr-2 h-4 w-4"/>Añadir Ficha</Button>
                </div>
                 <ScrollArea className="flex-grow">
                  {filteredDrugs.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">No se encontraron fármacos.</p>
                  ) : (
                    <div className="space-y-2">
                    {filteredDrugs.map((drug) => (
                      <div key={drug.id} role="button" tabIndex={0}
                        className="p-2 border rounded-md hover:bg-muted/50 flex justify-between items-center cursor-pointer"
                        onClick={() => handleDrugSelect(drug)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDrugSelect(drug); }}>
                        <div className="flex items-center gap-2">{drug.icon}<span>{drug.name}</span></div>
                      </div>
                    ))}
                    </div>
                  )}
                 </ScrollArea>
              </div>
            )}
            
            {view === 'detail' && selectedDrug && (
              <ScrollArea className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary">{selectedDrug.name}</h3>
                    {selectedDrug.isUserEntry && selectedDrug.entryData && (
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => setEditingEntry(selectedDrug.entryData!)}><Edit className="mr-1 h-3 w-3"/>Editar</Button>
                            <Button variant="destructive" size="sm" onClick={() => confirmDelete(selectedDrug.entryData!)}><Trash2 className="mr-1 h-3 w-3"/>Eliminar</Button>
                        </div>
                    )}
                </div>
                {SelectedDrugComponent ? (
                    <SelectedDrugComponent />
                ) : selectedDrug.entryData ? (
                    <div className="space-y-2">
                        {renderDetailSection("Acción Terapéutica", selectedDrug.entryData.action)}
                        {renderDetailSection("Presentaciones", selectedDrug.entryData.presentations)}
                        {renderDetailSection("Indicaciones", selectedDrug.entryData.indications)}
                        {renderDetailSection("Contraindicaciones", selectedDrug.entryData.contraindications)}
                        {renderDetailSection("Almacenamiento", selectedDrug.entryData.storage)}
                        {renderDetailSection("Reconstitución", selectedDrug.entryData.reconstitution)}
                        {renderDetailSection("Dosis", selectedDrug.entryData.dose)}
                        {renderDetailSection("Dilución", selectedDrug.entryData.dilution)}
                        {renderDetailSection("Administración", selectedDrug.entryData.administration)}
                        {renderDetailSection("Estabilidad de Solución", selectedDrug.entryData.solutionStability)}
                        {renderDetailSection("Velocidad de Administración", selectedDrug.entryData.administrationSpeed)}
                        {renderDetailSection("Sueros Compatibles", selectedDrug.entryData.compatibleSerums)}
                        {renderDetailSection("Observaciones / RAM", selectedDrug.entryData.ramObservations)}
                    </div>
                ) : (
                    <p>No hay detalles disponibles para este fármaco.</p>
                )}
              </ScrollArea>
            )}

            {view === 'form' && (
                <ScrollArea className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre del Fármaco</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="action" render={({ field }) => (<FormItem><FormLabel>Acción Terapéutica</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="presentations" render={({ field }) => (<FormItem><FormLabel>Presentaciones</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="indications" render={({ field }) => (<FormItem><FormLabel>Indicaciones</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="contraindications" render={({ field }) => (<FormItem><FormLabel>Contraindicaciones</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="storage" render={({ field }) => (<FormItem><FormLabel>Almacenamiento</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="reconstitution" render={({ field }) => (<FormItem><FormLabel>Reconstitución</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="dose" render={({ field }) => (<FormItem><FormLabel>Dosis</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="dilution" render={({ field }) => (<FormItem><FormLabel>Dilución</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="administration" render={({ field }) => (<FormItem><FormLabel>Administración</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="solutionStability" render={({ field }) => (<FormItem><FormLabel>Estabilidad de Solución</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="administrationSpeed" render={({ field }) => (<FormItem><FormLabel>Velocidad de Administración</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="compatibleSerums" render={({ field }) => (<FormItem><FormLabel>Sueros Compatibles</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="ramObservations" render={({ field }) => (<FormItem><FormLabel>Observaciones / RAM</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                                <Button type="button" variant="outline" onClick={() => { setView('list'); setEditingEntry(null); }}>Cancelar</Button>
                                <Button type="submit">Guardar Ficha</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            )}
          </div>
          
          <DialogFooter className="p-4 border-t flex-row justify-between items-center bg-muted/50">
            <div className="text-xs text-muted-foreground">
                Información extraída del{' '}
                <a href="https://www.laboratoriochile.cl/ebook/files/mme.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                    Manual de Medicamentos Endovenosos de Lizana, González y Villena
                </a>.
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la ficha del fármaco "{entryToDelete?.name}". No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DilucionesDialog;
