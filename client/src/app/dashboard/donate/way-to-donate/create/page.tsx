"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import CkEditor from "@/app/components/CkEditor";
import { InputField } from "@/app/components/InputField";
import Loader from "@/app/components/Loader";
import { RadioInput } from "@/app/components/RadioInput";
import Image from "next/image";

type BankingType =
  | "online_banking"
  | "bank_transfer"
  | "home_collection"
  | "international"
  | "";

type AccountForm = {
  _id: string;
  title: string;
  IBAN: string;
  branch: string;
  swift: string;
  bankIcon?: File | null;
};

type FormState = {
  bankingType: BankingType;
  cause: string;
  useAccounts: boolean;
  accounts: AccountForm[];
  accountsParagraph?: string;
};

type FormErrors = {
  bankingType?: string;
  cause?: string;
  causeDescription?: string;
  accounts?: string;
};

const emptyAccount = (): AccountForm => ({
  _id: "",
  title: "",
  IBAN: "",
  branch: "",
  swift: "",
  bankIcon: null,
});

const CreateWay: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>({
    bankingType: "",
    cause: "",
    useAccounts: true,
    accounts: [emptyAccount()],
  });
  const [causeDescription, setCauseDescription] = useState<string>("");
  const [accountsParagraph, setAccountsParagraph] = useState<string>("");

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name as keyof FormState]: value } as FormState));
  };

  const onCauseDescriptionChange = (editor: string, field: string) => {
    if (field === "description") setCauseDescription(editor);
  };

  const onAccountsParagraphChange = (editor: string, field: string) => {
    if (field === "paragraph") setAccountsParagraph(editor);
  };

  const onAccountChange = (
    index: number,
    field: keyof AccountForm,
    value: string | File | null
  ) => {
    setForm((p) => {
      const next = { ...p, accounts: [...p.accounts] };
      const acc = { ...next.accounts[index] } as AccountForm;
      if (field === "bankIcon") acc.bankIcon = value as File | null;
      else (acc[field] as string) = value as string;
      next.accounts[index] = acc;
      return next;
    });
  };

  const addAccount = () => {
    setForm((p) => {
      const updatedAccounts = [...p.accounts];
      const lastAcc = updatedAccounts[updatedAccounts.length - 1];

      // only lock in the last account if it has some data
      if (
        lastAcc.title ||
        lastAcc.IBAN ||
        lastAcc.branch ||
        lastAcc.swift ||
        lastAcc.bankIcon
      ) {
        updatedAccounts[updatedAccounts.length - 1] = {
          ...lastAcc,
        };
        updatedAccounts.push(emptyAccount());
      }

      return { ...p, accounts: updatedAccounts };
    });
  };

  const removeAccount = (idx: number) =>
    setForm((p) => {
      const updatedAccounts = p.accounts.filter((_, i) => i !== idx);
      return {
        ...p,
        accounts:
          updatedAccounts.length > 0 ? updatedAccounts : [emptyAccount()],
      };
    });

  const onCreateClick = async () => {
    const errs: FormErrors = {};
    if (!form.bankingType) errs.bankingType = "Bank Type is required";
    if (!form.cause) errs.cause = "Cause is required";
    if (!causeDescription) errs.causeDescription = "Description is required";
    if (form.useAccounts && form.accounts.length === 0)
      errs.accounts = "Add at least one account or switch to paragraph";
    if (!form.useAccounts && !accountsParagraph)
      errs.accounts = "Provide paragraph instructions when not using accounts";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const fd = new FormData();
    fd.append("bankingType", form.bankingType);
    fd.append("cause", form.cause);
    fd.append("causeDescription", causeDescription);

    if (form.useAccounts) {
      const accountsPayload = form.accounts.map((a) => ({
        _id: a._id, // backend can ignore or use this if needed
        title: a.title,
        IBAN: a.IBAN,
        branch: a.branch,
        swift: a.swift,
      }));

      // append all files with same key => backend pairs by index
      form.accounts.forEach((a) => {
        if (a.bankIcon instanceof File) {
          fd.append("bankIcon", a.bankIcon);
        }
      });

      fd.append("accounts", JSON.stringify(accountsPayload));
    } else {
      fd.append("accountsParagraph", accountsParagraph ?? "");
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/create`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }
      console.log("✅ Created:", data);
      router.push("/dashboard/donate/way-to-donate");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Create Way To Donate</h1>

      <div className="w-3/4 flex flex-col items-start">
        <label className="font-bold">Banking Type</label>
        <RadioInput
          name="bankingType"
          value={form.bankingType}
          onChange={onChangeInput}
          options={[
            "online_banking",
            "bank_transfer",
            "home_collection",
            "international",
          ]}
        />
        {errors.bankingType && (
          <p className="text-red-500">{errors.bankingType}</p>
        )}
      </div>

      <InputField
        label="Cause of Donation"
        name="cause"
        type="text"
        placeholder="Gaza Relief"
        value={form.cause}
        onChange={(e) => setForm({ ...form, cause: e.target.value })}
        error={errors.cause}
      />

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Cause Description</label>
        <CkEditor
          editorData={causeDescription}
          setEditorData={setCauseDescription}
          handleOnUpdate={onCauseDescriptionChange}
          field={"description"}
        />
        {errors.causeDescription && (
          <p className="text-red-500">{errors.causeDescription}</p>
        )}
      </div>

      <div className="flex items-center gap-5">
        <label htmlFor="account">Use bank accounts?</label>
        <input
          type="checkbox"
          name="account"
          checked={form.useAccounts}
          onChange={(e) =>
            setForm((p) => ({ ...p, useAccounts: e.target.checked }))
          }
        />
      </div>

      {form.useAccounts ? (
        <div>
          {form.accounts.map((acc, i) => (
            <div
              key={acc._id || i}
              className="p-3 border border-gray-300 rounded-md shadow-lg mb-3"
            >
              <div className="mt-2 flex items-center justify-between gap-10">
                <InputField
                  label="Bank Icon"
                  name="bankIcon"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onAccountChange(i, "bankIcon", e.target.files?.[0] ?? null)
                  }
                />
                {acc.bankIcon && (
                  <Image
                    src={URL.createObjectURL(acc.bankIcon)}
                    alt="preview"
                    className="h-20 w-20 mt-2 object-contain"
                    width={55}
                    height={55}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <InputField
                  label="Account Title"
                  name={`title-${i}`}
                  type="text"
                  placeholder="Bank Al-Habib"
                  value={acc.title}
                  onChange={(e) => onAccountChange(i, "title", e.target.value)}
                />
                <InputField
                  label="IBAN"
                  name={`IBAN-${i}`}
                  type="text"
                  placeholder="PK.."
                  value={acc.IBAN}
                  onChange={(e) => onAccountChange(i, "IBAN", e.target.value)}
                />
              </div>

              <div className="flex gap-2 mt-2">
                <InputField
                  label="Branch"
                  name={`branch-${i}`}
                  type="text"
                  placeholder="Branch"
                  value={acc.branch}
                  onChange={(e) => onAccountChange(i, "branch", e.target.value)}
                />
                <InputField
                  label="Swift Code"
                  name={`swift-${i}`}
                  type="text"
                  placeholder="SWIFT"
                  value={acc.swift}
                  onChange={(e) => onAccountChange(i, "swift", e.target.value)}
                />
              </div>

              <div className="mt-2 flex justify-end items-end gap-2">
                {i === form.accounts.length - 1 && (
                  <Button
                    btnText="Add more Account"
                    type="button"
                    secondary
                    onClickFunction={addAccount}
                    className="max-w-60"
                  />
                )}
                <Button
                  btnText="Remove"
                  type="button"
                  primary
                  onClickFunction={() => removeAccount(i)}
                  className="max-w-32"
                />
              </div>
            </div>
          ))}
          {errors.accounts && <p className="text-red-500">{errors.accounts}</p>}
        </div>
      ) : (
        <div>
          <label className="font-medium">Accounts Detail...</label>
          <CkEditor
            editorData={accountsParagraph}
            setEditorData={setAccountsParagraph}
            handleOnUpdate={onAccountsParagraphChange}
            field="paragraph"
          />
          {errors.accounts && <p className="text-red-500">{errors.accounts}</p>}
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Button
          type="button"
          btnText="Create Way"
          onClickFunction={onCreateClick}
          tertiary
          className="max-w-32"
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={() => router.push("/dashboard/donate/way-to-donate")}
          primary
          className="max-w-32"
        />
      </div>
    </div>
  );
};

export default CreateWay;
