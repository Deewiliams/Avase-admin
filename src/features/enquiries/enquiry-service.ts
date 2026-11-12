
import api from "../../lib/axios";

import type {
  Enquiry,
  EnquiryListParams,
  EnquiryListResponse,
  EnquiryDetailResponse,
  EnquiryMutationResponse,
  UpdateEnquiryStatusPayload,
  AddEnquiryNotePayload,
} from "./enquiry-types";

export const enquiryService = {
  // Get all enquiries with search, filters and pagination
  async getEnquiries(params?: EnquiryListParams): Promise<EnquiryListResponse> {
    const response = await api.get<EnquiryListResponse>("/enquiries", {
      params,
    });

    return response.data;
  },

  // Get a single enquiry by ID
  async getEnquiryById(id: string): Promise<EnquiryDetailResponse> {
    const response = await api.get<EnquiryDetailResponse>(
      `/enquiries/${id}`
    );

    return response.data;
  },

  // Update enquiry status
  async updateEnquiryStatus(
    id: string,
    payload: UpdateEnquiryStatusPayload
  ): Promise<EnquiryMutationResponse> {
    const response = await api.patch<EnquiryMutationResponse>(
      `/enquiries/${id}/status`,
      payload
    );

    return response.data;
  },

  // Add an internal admin note
  async addEnquiryNote(
    id: string,
    payload: AddEnquiryNotePayload
  ): Promise<EnquiryMutationResponse> {
    const response = await api.patch<EnquiryMutationResponse>(
      `/enquiries/${id}/notes`,
      payload
    );

    return response.data;
  },
};
