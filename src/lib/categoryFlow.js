// Shared helpers for the category-driven sell flow (Category -> Brand -> Model ->
// Condition -> [Storage] -> [Carrier] -> Assessment -> Price -> ...). Each category
// can turn the Storage and Carrier steps on/off and defines its own condition
// questions — see CategorySelection.jsx (which caches the full category object) and
// the admin Categories page (where these are configured).

export const getSelectedCategory = () => {
  try {
    return JSON.parse(localStorage.getItem('selectedCategoryData') || 'null');
  } catch {
    return null;
  }
};

export const hasCarrierStep = (category) => category?.hasCarrierStep === true;
export const hasStorageStep = (category) => category?.hasStorageStep === true;

// Where to go after the (always-shown) coarse condition-grade step.
export const routeAfterCondition = (category) => {
  if (hasStorageStep(category)) return '/storageselection';
  if (hasCarrierStep(category)) return '/carrierselection';
  return '/deviceassessment';
};

// Where to go after storage is picked.
export const routeAfterStorage = (category) => {
  if (hasCarrierStep(category)) return '/carrierselection';
  return '/deviceassessment';
};
