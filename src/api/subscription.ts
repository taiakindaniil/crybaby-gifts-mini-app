import apiClient from "./apiClient"

export interface MySubscription {
    id: number
    subscription_plan: {
        id: number
        name: string
        description: string
        price: number
        currency: string
        duration: number
    }
    start_date: string
    end_date: string
}

export const getMySubscription = async (): Promise<MySubscription> => {
    const res = await apiClient.get(`/me/subscription`)
    return res.data
}
