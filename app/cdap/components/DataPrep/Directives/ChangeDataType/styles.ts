import styled from 'styled-components';

export const FormContainer = styled.div`
  width: fit-content;
  padding: 16px;

  .MuiFormControl-root {
    margin-bottom: 16px;

    .MuiFormHelperText-root {
      font-size: 12px;
    }

    fieldset legend {
      font-size: 13px;
    }
  }

  .MuiOutlinedInput-root {
    width: 300px;
    height: 39px;
    font-size: 13px;
  }

  .MuiOutlinedInput-input {
    padding: 13px 14px;
    width: 100%;
    padding-right: 0;
  }

  .MuiInputLabel-formControl.MuiInputLabel-shrink {
    transform: translate(14px, -7px) scale(1);
  }

  .MuiInputLabel-outlined {
    transform: translate(14px, 13px) scale(1);
  }

  .MuiInputLabel-root {
    font-size: 13px;
  }

  .MuiSelect-root {
    position: relative;
  }

  .MuiSelect-icon.MuiSelect-iconOutlined {
    right: 50px;
    top: calc(50% - 10px);
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;
