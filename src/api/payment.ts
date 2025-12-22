import apiClient from "./apiClient"

export interface Invoice {
    invoice_link: string
}

export const createInvoice = async (subscriptionId: number): Promise<Invoice> => {
    const res = await apiClient.post(`/payments/stars/invoice`, { subscription_id: subscriptionId })
    return res.data
}
