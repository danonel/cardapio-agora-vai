import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { EnterTableForm } from "../domains/Table/enter-table";
import { Tables } from "../services/tables";

const INITIAL_VALUES = {
  tableNumber: "",
};

const generateUniqueId = (): string => {
  return "xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedTableId = sessionStorage.getItem("tableId");
    if (storedTableId) {
      navigate(`/table?tableId=${storedTableId}`);
    }
  }, [navigate]);

  const onSubmit = async ({ tableNumber }: { tableNumber: string }) => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = generateUniqueId();
      sessionStorage.setItem("sessionId", sessionId);
    }
    sessionStorage.setItem("tableId", tableNumber);
    await Tables.updateTableMembers(tableNumber, [sessionId]);
    navigate(`/table?tableId=${tableNumber}`);
  };

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: onSubmit,
  });

  return (
    <EnterTableForm
      values={values}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
