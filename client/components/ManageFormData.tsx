import { useState } from 'react';

const ManageFormData = () => {
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData(prev => ({
            // ...prev: copy the lastest value of formData
            ...prev,
            [name]: value,
        }));
    };
    // This hook provide those 3 functions for import page to use
    return {formData, OnInputChange, setFormData};
}

export default ManageFormData;