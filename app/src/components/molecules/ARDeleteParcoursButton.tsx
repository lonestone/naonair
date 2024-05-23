import React, { useCallback, useState } from 'react';
import { IconButton, Portal } from 'react-native-paper';
import { theme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ARConfirmModal from '../../components/templates/ARConfirmModal';

type ARDeleteParcoursButtonProps = {
  onDelete: () => void;
};

const ARDeleteParcoursButton = ({ onDelete }: ARDeleteParcoursButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const trashIcon = useCallback(
    () => <Icon name="trash-can" size={24} color={theme.colors.error} />,
    [],
  );

  return (
    <>
      <IconButton icon={trashIcon} onPress={() => setModalOpen(true)} />
      <Portal>
        <ARConfirmModal
          open={modalOpen}
          headline="Souhaitez-vous vraiment supprimer le parcours ?"
          caption="Cette action est irréversible et supprimera votre parcours personnalisé"
          setOpen={setModalOpen}
          onPress={() => {
            setModalOpen(false);
            onDelete();
          }}
        />
      </Portal>
    </>
  );
};

export default ARDeleteParcoursButton;
