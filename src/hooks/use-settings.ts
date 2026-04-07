import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tutorProfileAPI } from "@/lib/api";
import { TutorCompleteSettings } from '@/types/api';

export const useSettingsQuery = () => {
    return useQuery({
        queryKey: ['tutor-settings'],
        queryFn: async () => {
            const response = await tutorProfileAPI.getTutorCompleteSettings();
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateSettingsMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Partial<TutorCompleteSettings>) => {
            const response = await tutorProfileAPI.updateTutorCompleteSettings(data);
            if (!response.success) {
                const error = new Error(response.message);
                (error as any).response = { data: response };
                throw error;
            }
            return response;
        },
        onSuccess: (response) => {
             queryClient.setQueryData(['tutor-settings'], response.data);
        },
    });
};