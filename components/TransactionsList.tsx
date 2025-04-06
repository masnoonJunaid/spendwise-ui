import React, { useEffect, useState } from "react";
import {
  Button,
  Listbox,
  ListboxItem,
  Input,
  Spacer,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { createCategory } from "@/state/features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { displayToast } from "@/utils/functions";
import { AppDispatch } from "@/state/store";

export const ListboxWrapper: React.FC<React.PropsWithChildren<{}>> = ({children}) => (
  <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);


export default function TransactionList() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", "), [selectedKeys]);
   const [summaryMonth, setSummaryMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    

    const categoriesKey = [
      {key: "income", label: "Income"},
      {key: "expense", label: "Expense"},
    ]

    const categoryAddStatus = useSelector((state: any) => state.categories?.addCategoryStatus);
    const category  =  useSelector((state: any) => state.categories);
    console.log("Category add status", categoryAddStatus);
    console.log("Category data", category);


    const handleCreateCategory = async (onClose: () => void) => {
      const userId = localStorage?.getItem('userId');
      if (!userId || !categoryName || !categoryType) return;
    
      try {
        await dispatch(createCategory({
          name: categoryName,
          category_type: categoryType,
          user_id: userId,
        })).unwrap();
    
        onClose(); // Close modal on success
        setCategoryName("");
        setCategoryType("");
      } catch (err) {
        console.error('Failed to create category:', err);
        const errorMessage = (err as { message?: string })?.message || 'Something went wrong while adding category, please try again';
        displayToast(errorMessage, "", "sm", "danger");
      }
    };

    useEffect(() => {
      if(categoryAddStatus === 'succeeded') {
        displayToast("Category added successfully", "", "sm", "success");
      } 
      if(categoryAddStatus === 'failed') {
        displayToast(categoryAddStatus?.addError, "", "sm", "danger");
      }
    }, [categoryAddStatus]);
    

  return (
    <div className="flex flex-col gap-2">
     <div className="flex flex-col gap-2 items-end mr-20">
        <Button className="max-w-[9rem]" size="sm" color="primary">
          Add Transaction +
        </Button>
        <Spacer/>
      </div>
      <ListboxWrapper>
        <Listbox
          disallowEmptySelection
          aria-label="Single selection example"
        //   selectedKeys={selectedKeys}
          selectionMode="single"
          variant="flat"
          onSelectionChange={(keys) => {
            if (keys instanceof Set) {
              setSelectedKeys(new Set(Array.from(keys) as string[]));
            } else {
              setSelectedKeys(new Set([keys]));
            }
          }}
          isVirtualized
          label={"Select from 1000 items"}
          virtualization={{
            maxListboxHeight: 260,
            itemHeight: 40,
          }}
        >
          <ListboxItem showDivider key="text">Text</ListboxItem>
          <ListboxItem showDivider key="number">Number</ListboxItem>
          <ListboxItem showDivider key="date">Date</ListboxItem>
          <ListboxItem showDivider key="single_date">Single Date</ListboxItem>
          <ListboxItem showDivider key="iteration">Iteration</ListboxItem>
        </Listbox>
      </ListboxWrapper>
      <Spacer/>
      <Spacer/>
      <div className="flex justify-between items-center gap-x-4">
        <Input
          label="Month"
          type="month"
          placeholder="Select month"
          value={summaryMonth}
          onChange={(e) => setSummaryMonth(e.target.value)}
          size="sm"
          className="flex-1"
        />
        {/* Add Button */}
        <Button
          size="sm"
          className="whitespace-nowrap"
          color="primary"
          onPress={onOpen}
        >
            Add Catergory +
          </Button>
      </div>
      <Modal size="sm" isOpen={isOpen} backdrop="blur" placement="top-center" onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add Transaction Category</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Category Name"
                      type="text"
                      placeholder="Enter expense/income category name"
                      size="sm"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <Select
                      label="Category Type"
                      placeholder="Select category type"
                      value={categoryName}
                      onChange={(e) => setCategoryType(e.target.value)}
                      size="sm">
                      {categoriesKey.map((category) => (
                        <SelectItem key={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                      </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="danger"
                    variant="flat"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={ !categoryName || !categoryType}
                    onPress={() => handleCreateCategory(onClose)}
                    // isDisabled={!amount || !month}
                    // isLoading={budgetUpdate?.setBudgetStatus === 'loading'}
                    isLoading={categoryAddStatus === 'loading'}
                  >
                    Add
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
    </div>
  );
}

