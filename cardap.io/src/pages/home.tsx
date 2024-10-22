import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { EnterTableForm } from "../domains/Table/enter-table";

const INITIAL_VALUES = {
  tableNumber: "",
};

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedTableId = sessionStorage.getItem("tableId");
    if (storedTableId) {
      navigate(`/table?tableId=${storedTableId}`);
    }
  }, [navigate]);

  const onSubmit = ({ tableNumber }: { tableNumber: string }) => {
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
