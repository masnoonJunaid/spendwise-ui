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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DatePicker,
  Textarea,
  Spinner,
} from "@heroui/react";
import { createCategory, fetchCategories } from "@/state/features/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { displayToast } from "@/utils/functions";
import { AppDispatch } from "@/state/store";
import { addTransaction, fetchTransactions } from "@/state/features/transactionSlice";

export const ListboxWrapper: React.FC<React.PropsWithChildren<{}>> = ({children}) => (
  <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);


export default function TransactionList() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const modal = useDisclosure();
  const drawer = useDisclosure();
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    const categoryList  =  useSelector((state: any) => state.categories?.categories);
    console.log("Category add status", categoryAddStatus);
    console.log("Category data", categoryList);


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

    useEffect(() => {
      dispatch(fetchCategories())
    }, [])


    const handleAddTransaction = async (onClose: () => void) => {
      const userId = localStorage.getItem("userId");
      if (!userId || !amount || !transactionType || !categoryId || !date) return;
    
      try {
        await dispatch(
          addTransaction({
            amount: parseFloat(amount),
            transaction_type: transactionType,
            description,
            date, // e.g., "2025-03-30"
            category: Number(categoryId), // Convert to number here ✅
          })
        ).unwrap();
        
    
        displayToast("Transaction added successfully", "", "sm", "success");
        onClose(); // Close modal
      } catch (err: any) {
        displayToast("Failed to add transaction", "", "sm", "danger");
        console.error("Transaction error:", err);
      }
    };

    const addTransactionStatus = useSelector((state: any) => state.transactions?.addTransactionStatus);

    
    useEffect(() => {
      dispatch(fetchTransactions())
    }, [addTransactionStatus]);
    console.log("Transaction data", amount, transactionType,"Category id>>", categoryId, date);
    const transactionList = useSelector((state: any) => state.transactions?.transactions);
    const loadTransactionStatus = useSelector((state: any) => state.transactions?.status);

  return (
    <div className="flex flex-col gap-2">
     <div className="flex flex-col gap-2 items-end mr-20">
        <Button 
          onPress={() => drawer.onOpen()}
          className="max-w-[9rem]" size="sm" color="primary">
          Add Transaction +
        </Button>
        <Spacer/>
      </div>
      <ListboxWrapper>
      { loadTransactionStatus === 'loading' ? <Spinner/> :
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
       {
          transactionList &&  transactionList?.map((item: {
            id: number;
            amount: string;
            transaction_type: 'income' | 'expense';
            description: string;
            date: string;
            category: number; // or category name if populated
          }) => {
            const isIncome = item.transaction_type === 'income';
            const sign = isIncome ? '+' : '-';
            const colorClass = isIncome ? 'text-green-600' : 'text-red-600';

            return (
              <ListboxItem
                key={String(item.id)}
                className="flex justify-between items-center"
                showDivider
                description={item.description}
              >
                <div className="flex flex-row gap-16 items-end">
                  <span className={`font-semibold ${colorClass}`}>
                    {sign}₹{parseFloat(item.amount).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
               
              </ListboxItem>
            );
          })}
        </Listbox>
}
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
          onPress={modal.onOpen}
        >
            Add Catergory +
          </Button>
      </div>
      <Modal size="sm" isOpen={modal.isOpen} backdrop="blur" placement="top-center" onOpenChange={modal.onOpenChange}>
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
        <Drawer isOpen={drawer.isOpen} size="xs" onClose={ () => drawer.onClose()}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
              <DrawerBody>
                <Input
                  type="number"
                  label="Amount"
                  placeholder="Enter transaction amount"
                  size="sm"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Spacer/>
                <Select
                  label="Category"
                  placeholder="Select category"
                  value={categoryId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setCategoryId(id);
                    const selected = categoryList.find((item: { id: number; name: string; category_type: string }) => String(item.id) === id);
                    if (selected) {
                      setTransactionType(selected.category_type); // This ensures it matches
                    }
                  }}
                  size="sm"
                >
                  {categoryList.map((item: { id: number; name: string; category_type: string }) => (
                    <SelectItem key={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Spacer/>
                <DatePicker
                  label="Date"
                  // value={date || null}
                  onChange={(date) => setDate(date ? new Date(date.toString()).toISOString().split("T")[0] : "")}
                  // onChange={(e) => setDate(e?.toISOString().split("T")[0] || "")}
                  size="sm"
                />
                <Spacer/>
                <Textarea
                  className="max-w-xs" 
                  label="Description" 
                  placeholder="Enter your description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={() => drawer.onClose()}>
                  Close
                </Button>
                <Button
                  isLoading={addTransactionStatus === 'loading'}
                  color="primary"
                  onPress={() => handleAddTransaction(() => drawer.onClose())}
                  isDisabled={ !amount || !transactionType || !categoryId || !date} >
                  Add
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

