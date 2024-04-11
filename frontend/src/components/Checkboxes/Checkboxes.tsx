import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

type CheckBoxProps = {
    checked: boolean,
    label: string,
    handleOnClick: () => void
}

export default function Checkboxes({checked, label, handleOnClick}: Readonly<CheckBoxProps>) {
    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    checked={checked}
                    color= "primary"
                    onClick={handleOnClick}
                />
            }
                              label={label}
            />
        </FormGroup>
    )
}