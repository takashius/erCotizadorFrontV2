import FontAwesome from "@expo/vector-icons/FontAwesome";
import { t } from "i18next";
import { Button, Icon, Popover } from "native-base";
import { useState } from "react";

export default ({
  data,
  rowMap,
  deleteMutation,
  deleteRow,
  idParent = null,
}: {
  data: any;
  rowMap: any;
  deleteMutation: any;
  deleteRow?: any;
  idParent?: string | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    setIsOpen(false);
    if (idParent) {
      deleteMutation.mutate({ id: data.item._id, idParent });
    } else {
      deleteMutation.mutate(data.item._id);
    }
    deleteRow && deleteRow(rowMap, data?.item._id);
  };

  return (
    <Popover
      placement="left top"
      trigger={(triggerProps) => (
        <Button
          colorScheme="danger"
          alignSelf="center"
          {...triggerProps}
          onPress={handlePress}
        >
          <Icon
            marginTop={1}
            as={<FontAwesome name="times-circle" />}
            size={"2xl"}
            color={"white"}
          />
        </Button>
      )}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <Popover.Content w="56">
        <Popover.Arrow />
        <Popover.CloseButton onPress={handleClose} />
        <Popover.Header>{t("delete")}</Popover.Header>
        <Popover.Body>{t("deleteMessage")}</Popover.Body>
        <Popover.Footer justifyContent="flex-end">
          <Button.Group space={2}>
            <Button
              colorScheme="coolGray"
              variant="ghost"
              onPress={handleClose}
            >
              {t("cancel")}
            </Button>
            <Button colorScheme="danger" onPress={handleDelete}>
              {t("delete")}
            </Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
};
