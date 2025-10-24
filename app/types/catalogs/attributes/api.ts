import type { ProductAttribute, ProductAttributeValue } from './types';
import type { ApiResponse } from '~/types/common';

export interface AttributesListResponse extends ApiResponse<ProductAttribute[]> {}

export interface AttributeDetailResponse extends ApiResponse<ProductAttribute> {}

export interface AttributeCreateResponse extends ApiResponse<ProductAttribute> {}

export interface AttributeUpdateResponse extends ApiResponse<ProductAttribute> {}

export interface AttributeDeleteResponse extends ApiResponse<{ message: string }> {}

export interface AttributeValuesListResponse extends ApiResponse<ProductAttributeValue[]> {}

export interface AttributeValueCreateResponse extends ApiResponse<ProductAttributeValue> {}

export interface AttributeValueBulkCreateResponse extends ApiResponse<ProductAttributeValue[]> {}

export interface AttributeValueUpdateResponse extends ApiResponse<ProductAttributeValue> {}

export interface AttributeValueDeleteResponse extends ApiResponse<{ message: string }> {}
