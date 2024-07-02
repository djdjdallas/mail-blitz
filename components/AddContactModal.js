"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Supabase client

const supabase = createClientComponentClient();

export default function AddContactModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from("contacts").insert([
        {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          company: formData.company,
        },
      ]);

      if (error) {
        console.error("Error inserting data: ", error);
      } else {
        console.log("Data inserted successfully: ", data);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Contact</CardTitle>
                    <CardDescription>
                      Please fill in the details for the new contact.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="grid gap-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          className="w-full"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="text"
                          className="w-full"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          type="text"
                          className="w-full"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Contact
                  </Button>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
