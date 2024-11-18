export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface Product {
    id: number;
    name: string;
    description: string;
    code: string;
    price: number;
    stock: number;
    sales: number;
    image: string;
    category_id: number;
    category: Category;
}
  
export interface Category {
    id: number;
    name: string;
}

export interface PaginatedResponse {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
    products: Product[];
}

export interface DashboardMetrics {
    total_products: number;
    low_stock_products: number;
    total_stock_value: number;
    total_sales: number;
    total_revenue: number;
    start_date?: string;
    end_date?: string;
}

export interface AddProductModalProps {
    onCancel: () => void;
    categories: { id: number; name: string }[];
    setCategories: SetState<Category[]>;
    fetchProducts: () => void;
}

export interface CategorySelectorProps {
    categories: { id: number; name: string }[];
    selectedCategoryId: number | "";
    setCategoryId: (id: number | "") => void;
    setCategories?: (categories: { id: number; name: string }[]) => void;
}


export interface DashboardCardProps {
    title: string;
    value: string | number | undefined;
    icon: React.ReactNode;
    borderColor: string;
    gradient?: string;
    className?: string;
    message?: string;
  }
  

export interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
  }

export interface ProductDetailsModalProps {
    product: Product;
    categories: { id: number; name: string }[];
    setCategories: SetState<Category[]>;
    onUpdateComplete: () => void;
    onClose: () => void;
}

export interface ChartDataItem {
    label: string | null;
    value: number;
  }

export interface ToggleChartProps {
  endpoint: string;
  title: string;
  labelKey: string;
  valueKey: string;
  initialChartType?: "pie" | "bar";
  start_date: string;
  end_date: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    profile_image: string;
    email: string;
}

export interface AuthContextProps {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface ProductTableProps {
    products: Product[];
    handleHeaderClick: (column: string) => void;
    orderBy: string;
    order: string;
    setSelectedProduct: (product: Product) => void;
  }
  