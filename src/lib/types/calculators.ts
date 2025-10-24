export interface CalculatorItem {
    name: string;
    description: string;
    implemented: boolean;
    component?: React.LazyExoticComponent<React.FC<object>>;
    icon?: React.ReactNode;
    categoryName?: string;
  }
  
  export interface CalculatorCategoryData {
    name: string;
    icon: React.ReactNode;
    items: CalculatorItem[];
  }
  
  export interface ScaleItem {
    name: string;
    description: string;
    implemented: boolean;
    component?: React.LazyExoticComponent<React.FC<object>>;
    icon?: React.ReactNode;
    categoryName?: string;
  }
  
  export interface ScaleCategoryData {
    name: string;
    icon: React.ReactNode;
    items: ScaleItem[];
  }
  