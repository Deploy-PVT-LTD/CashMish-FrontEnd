import { Navigate } from "react-router-dom";

const FlowProtectedRoute = ({ children, requiredStep, redirectTo="/" }) => {
  const currentStep = Number(localStorage.getItem("currentStep") || 0);

  if (currentStep < requiredStep) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default FlowProtectedRoute;
