import { Button } from "../Button/Button";
import { ContentContainer } from "../ContentContainer/ContentContainer";
import { Overlay } from "../Overlay/Overlay"
import {Text} from  '../Text/Text'


type DeleteModalProps ={

    onClose : () => void;
    onConfirmDelete: () => void;
}
const DeleteModal = ({onClose, onConfirmDelete} : DeleteModalProps) => {
  return (
  <Overlay >
    <ContentContainer>
        <Text variant='h1'>Confirm Delete</Text>
        <Text variant='h5'> Are  you sure you want to Delete?</Text>
        <Button
        label='Yes delete'
        onClick={onConfirmDelete}
        />
        <Button
        label='Cancel'
        onClick={onClose}
        />
    </ContentContainer>
  </Overlay>
  )
}

export default DeleteModal
