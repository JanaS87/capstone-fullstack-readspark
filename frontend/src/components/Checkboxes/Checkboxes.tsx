import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import React from "react";

type CheckBoxProps = {
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string
}

export default function Checkboxes({checked, onChange, label}: CheckBoxProps) {
    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                    color= "primary"
                />
            }
                              label={label}
            />
        </FormGroup>
    )
}