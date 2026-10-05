// Shared helpers for the category-driven sell flow. Storage and carrier are now
// collected on the assessment page; category settings still control which fields
// appear there.

export const getSelectedCategory = () => {
  try {
    return JSON.parse(localStorage.getItem('selectedCategoryData') || 'null');
  } catch {
    return null;
  }
};

export const hasCarrierStep = (category) => category?.hasCarrierStep === true;
export const hasStorageStep = (category) => category?.hasStorageStep === true;

// Storage and carrier are collected together on the assessment page.
export const routeAfterCondition = () => '/deviceassessment';

// Keep legacy storage-page callers moving into the current flow.
export const routeAfterStorage = () => '/deviceassessment';
