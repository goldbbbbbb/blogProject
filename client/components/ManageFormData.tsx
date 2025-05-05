import { useState } from 'react';

// validate function
// name: key(username, email, password) value: userinput in key
const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'username':
        if (!value) return '用戶名不能為空';
        if (value.length < 8) return '用戶名至少需要8個字符';
        return '';
      
      case 'email':
        if (!value) return '電子郵件不能為空';
        if (!value.includes('@')) return '請輸入有效的電子郵件地址';
        return '';
      
      case 'password':
        if (!value) return '密碼不能為空';
        if (value.length < 8) return '密碼至少需要8個字符';
        if (!/[A-Z]/.test(value)) return '密碼需要包含至少一個大寫字母';
        if (!/[a-z]/.test(value)) return '密碼需要包含至少一個小寫字母';
        if (!/[0-9]/.test(value)) return '密碼需要包含至少一個數字';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) 
          return '密碼需要包含至少一個特殊符號';
        return '';
      
      default:
        return '';
    }
  };

const ManageFormData = () => {
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prev => ({
            // ...prev: copy the lastest value of formData
            ...prev,
            [name]: value,
        }));
        // errorMessage = '' or referring errorMsg
        const errorMessage = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    };

    const validateAll = (): boolean => {
        const newErrors: {[key: string]: string} = {};
        let isValid = true;
        
        // valid all input before submit
        Object.entries(formData).forEach(([name, value]) => {
            const errorMessage = validateField(name, value);
            newErrors[name] = errorMessage;
            if (errorMessage) {
                isValid = false;
            }
        });
        
        setErrors(newErrors);
        return isValid;
    };

    // This hook provide those functions for import page to use
    return {formData, setFormData, errors, setErrors, OnInputChange, validateAll};
}

export default ManageFormData;