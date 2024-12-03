import { Button, Modal } from "native-base";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import { t } from "i18next";
import { Address } from "../types/customer";
import { useCreateAddress, useUpdateAddress } from "../api/customer";
import Spinner from "./helpers/Spinner";
import { ModalAddressProps } from "../types/general";

const ModalAddress = ({
  idCustomer,
  post,
  open,
  setOpen,
  setSubmit,
  params,
}: ModalAddressProps) => {
  const defaultData: Address = {
    title: "",
    city: "",
    line1: "",
    line2: "",
    zip: "",
    id: idCustomer,
    default: false,
  };

  const transformData = (params: Address) => ({
    title: params?.title ? params.title : "",
    city: params?.city ? params.city : "",
    line1: params?.line1 ? params.line1 : "",
    line2: params?.line2 ? params.line2 : "",
    zip: params?.zip ? params.zip : "",
    id: params?.id!,
    idAddress: params?._id!,
    default: params?.default!,
  });
  const [errors, setErrors] = useState<Object>({});
  const [formData, setData] = useState<Address>(defaultData);
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const validate = (formData: Address) => {
    if (formData.title === undefined || formData.title === "") {
      setErrors({ ...errors, title: t("address.validations.title") });
      return false;
    } else if (!formData.city) {
      setErrors({ ...errors, city: t("address.validations.city") });
      return false;
    } else if (!formData.line1) {
      setErrors({ ...errors, line1: t("address.validations.line1") });
      return false;
    }
    setErrors({});
    return true;
  };

  const onSubmit = (formData: Address) => {
    if (validate(formData)) {
      formData.id = idCustomer;
      setData(defaultData);
      if (post === "new") {
        createMutation.mutate(formData);
      } else {
        updateMutation.mutate(formData);
      }
    }
  };

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      setSubmit(true);
      setOpen(false);
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess]);

  useEffect(() => {
    if (params && post === "edit") {
      setData(transformData(params!));
    } else {
      setData(defaultData);
    }
  }, [params, open]);

  const onClose = () => {
    setOpen(false);
    setData(defaultData);
  };

  return (
    <Modal isOpen={open} onClose={() => onClose()} safeAreaTop={true}>
      <Modal.Content maxWidth="450">
        <Modal.CloseButton />
        <Modal.Header>
          {post === "new" ? t("address.new") : t("address.edit")}
        </Modal.Header>
        <Modal.Body>
          {createMutation.isPending ? (
            <Spinner />
          ) : (
            <AddressForm
              post={"new"}
              params={params}
              errors={errors}
              setErrors={setErrors}
              formData={formData}
              setData={setData}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                onSubmit(formData);
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ModalAddress;
