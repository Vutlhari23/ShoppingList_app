import { Button } from "../Button/Button";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { Overlay } from "../Overlay/Overlay";
import { Text } from "../Text/Text";
import styles from '../Modals/AddItemModal.module.css'

type DeleteModalProps = {
  onClose: () => void;
  onConfirmDelete: () => void;
};
const DeleteModal = ({ onClose, onConfirmDelete }: DeleteModalProps) => {
  return (
    <Overlay>
      <ContentContainer className={styles['delete-modal']}>
        <Text variant="h1">Confirm Delete</Text>
        <Text variant="h5"> Are you sure you want to Delete?</Text>
        <ContentContainer className={styles.options} >
        <Button label="Cancel" onClick={onClose} />
        <Button
        className={styles.delete}
         label="Yes delete" onClick={onConfirmDelete} />
        
        </ContentContainer>
      </ContentContainer>
    </Overlay>
  );
};

export default DeleteModal;
