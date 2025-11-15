import { useState } from "react";
import { useSwrLite } from "@/lib/swr-lite";
import {
    createSpecialization,
    deactivateSpecialization,
    deleteSpecialization,
    fetchSpecializations,
    reactivateSpecialization,
    updateSpecialization,
} from "./api";
import type {
    CreateSpecializationPayload,
    SpecializationFilters,
    SpecializationsResponse,
    UpdateSpecializationPayload,
} from "./types";

function serializeFilters(filters: SpecializationFilters) {
    return JSON.stringify({
        ...filters,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
    });
}

export function useSpecializations(initialFilters: SpecializationFilters = {}) {
    const [filters, setFilters] = useState<SpecializationFilters>(initialFilters);
    const key = `admin-specializations-${serializeFilters(filters)}`;
    const { data, error, isLoading, reload } = useSwrLite<SpecializationsResponse>(
        key,
        () => fetchSpecializations(filters),
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    );

    const handleCreateSpecialization = async (payload: CreateSpecializationPayload) => {
        await createSpecialization(payload);
        await reload();
    };

    const handleUpdateSpecialization = async (
        id: string,
        payload: UpdateSpecializationPayload,
    ) => {
        await updateSpecialization(id, payload);
        await reload();
    };

    const handleDeleteSpecialization = async (id: string, hard = false) => {
        await deleteSpecialization(id, hard);
        await reload();
    };

    const handleDeactivateSpecialization = async (id: string) => {
        await deactivateSpecialization(id);
        await reload();
    };

    const handleReactivateSpecialization = async (id: string) => {
        await reactivateSpecialization(id);
        await reload();
    };

    return {
        specializations: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.number ?? 0,
        pageSize: data?.size ?? 20,
        isLoading,
        error,
        filters,
        setFilters,
        createSpecialization: handleCreateSpecialization,
        updateSpecialization: handleUpdateSpecialization,
        deleteSpecialization: handleDeleteSpecialization,
        deactivateSpecialization: handleDeactivateSpecialization,
        reactivateSpecialization: handleReactivateSpecialization,
        refresh: reload,
    };
}
