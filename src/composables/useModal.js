import { ref, watch } from 'vue';

// export function useModal(props, emit, initialForm = {}) {
//     // Local reactive modal visibility
//     const isVisible = ref(props.visible);
//
//     // Sync with parent prop
//     watch(() => props.visible, val => isVisible.value = val);
//
//     // Reactive form data
//     const form = ref({ ...initialForm });
//
//     // Close modal
//     function handleClose() {
//         isVisible.value = false;
//         emit('update:visible', false);
//         emit('close');
//     }
//
//     // Save modal (can customize)
//     function handleSave(customSaveFn) {
//         if (customSaveFn) {
//             customSaveFn(form.value);
//         } else {
//             console.log('Form data:', form.value);
//         }
//         handleClose();
//     }
//
//     return {
//         isVisible,
//         form,
//         handleClose,
//         handleSave
//     };
// }


export function useModal(props, emit, initialForm = {}) {
    const isVisible = ref(props.visible);

    watch(() => props.visible, val => isVisible.value = val);

    const form = ref({ ...initialForm });

    function handleClose() {
        isVisible.value = false;
        emit('update:visible', false);
        emit('close');
    }

    async function handleSave(customSaveFn) {
        if (customSaveFn) {
            await customSaveFn(form.value);
        } else {
            console.log('Form data:', form.value);
        }
        handleClose();
    }

    return { isVisible, form, handleClose, handleSave };
}