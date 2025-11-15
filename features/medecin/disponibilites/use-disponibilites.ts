import { useState } from "react";
import { useSwrLite } from "@/lib/swr-lite";
import {
    createDisponibilite,
    deleteDisponibilite,
    fetchDisponibilites,
    updateDisponibilite,
    activateDisponibilite,
    deactivateDisponibilite,
} from "./api";
import type {
    CreateDisponibilitePayload,
    DisponibiliteFilters,
    DisponibilitesResponse,
    UpdateDisponibilitePayload,
} from "./types";

function serializeFilters(filters: DisponibiliteFilters) {
    return JSON.stringify({
        ...filters,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
    });
}

export function useDisponibilites(initialFilters: DisponibiliteFilters = {}) {
    const [filters, setFilters] = useState<DisponibiliteFilters>(initialFilters);
    const key = `medecin-disponibilites-${serializeFilters(filters)}`;

    const { data, error, isLoading, reload } = useSwrLite<DisponibilitesResponse>(
        key,
        () => fetchDisponibilites(filters),
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    );

    const handleCreateDisponibilite = async (payload: CreateDisponibilitePayload) => {
        await createDisponibilite(payload);
        await reload();
    };

    const handleUpdateDisponibilite = async (
        id: string,
        payload: UpdateDisponibilitePayload,
    ) => {
        await updateDisponibilite(id, payload);
        await reload();
    };

    const handleDeleteDisponibilite = async (id: string) => {
        await deleteDisponibilite(id);
        await reload();
    };

    const handleActivateDisponibilite = async (id: string) => {
        await activateDisponibilite(id);
        await reload();
    };

    const handleDeactivateDisponibilite = async (id: string) => {
        await deactivateDisponibilite(id);
        await reload();
    };

    return {
        disponibilites: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        currentPage: data?.number ?? 0,
        pageSize: data?.size ?? 20,
        isLoading,
        error,
        filters,
        setFilters,
        createDisponibilite: handleCreateDisponibilite,
        updateDisponibilite: handleUpdateDisponibilite,
        deleteDisponibilite: handleDeleteDisponibilite,
        activateDisponibilite: handleActivateDisponibilite,
        deactivateDisponibilite: handleDeactivateDisponibilite,
        reload,
    };
}
