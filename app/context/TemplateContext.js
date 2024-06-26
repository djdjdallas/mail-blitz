"use client";

import { createContext, useContext, useState } from "react";

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [template, setTemplate] = useState(null);

  return (
    <TemplateContext.Provider
      value={{ template, setSelectedTemplate: setTemplate }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  return useContext(TemplateContext);
};
