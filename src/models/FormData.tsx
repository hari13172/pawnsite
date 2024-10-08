
// Types for data
export interface Payment {
    date: string;
    amount: number;
}

export interface FormData {
    app_no: number;  // Change from string to number
    username: string;
    address: string;
    ph_no: number;  // Change from string to number
    item_weight: number;  // Change from string to number
    amount: number;  // Change from string to number
    pending: number;  // Change from string to number
    current_amount: number;  // Change from string to number
    start_date: string;
    end_date: string;
    note: string;
    image: string[];
    status: 'pending' | 'completed';
    payment_history: string;
}