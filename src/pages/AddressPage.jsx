import { useEffect, useState } from "react";
import AddressForm from "../components/AddressForm";
import AddressList from "../components/AddressList";

const AddressPage = () => {
  const [editingAddress, setEdditingAdress] = useState(null);

  useEffect(() => {
    if (editingAddress) {
      window.scrollTo({ button: 0, behavior: "smooth" });
    }
  }, [editingAddress]);
  return (
    <>
      <AddressList setEdditingAdress={setEdditingAdress} />
      <AddressForm
        editingAddress={editingAddress}
        setEdditingAdress={setEdditingAdress}
      />
    </>
  );
};
export default AddressPage;
