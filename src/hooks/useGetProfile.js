import { getProfile } from "../utils/fn";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile(token) {
    return useQuery({
        queryKey:['profile'],
        queryFn: ()=>getProfile(token),
        enabled: !!(token),
        staleTime: 5 * 60 * 1000
    })
}