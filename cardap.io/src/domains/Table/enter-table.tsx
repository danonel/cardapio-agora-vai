import { Button, Input } from "@mui/base";
import i18n from "../../common/i18n";
import { ChangeEvent } from "react";

type TEnterTableForm = {
  onSubmit: () => void;
  values: {
    tableNumber: string;
  };
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const EnterTableForm: React.FC<TEnterTableForm> = ({
  onSubmit,
  values,
  onChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <label>{i18n.t("home.tableNumberPlaceholder")}</label>
      <Input
        onChange={onChange}
        type="text"
        name="tableNumber"
        placeholder={i18n.t("home.tableNumberPlaceholder")}
      />
      <Button type="submit" disabled={!values.tableNumber}>
        Entrar
      </Button>
    </form>
  );
};
