"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/Button";
import CkEditor from "@/app/components/CkEditor";
import { InputField } from "@/app/components/InputField";
import { RadioInput } from "@/app/components/RadioInput";
import Image from "next/image";
import Title from "@/app/components/Title";

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
  bankIcon?: File | string | null;
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

const EditWay: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormState>({
    bankingType: "",
    cause: "",
    useAccounts: true,
    accounts: [emptyAccount()],
  });
  const [causeDescription, setCauseDescription] = useState("");
  const [accountsParagraph, setAccountsParagraph] = useState("");

  useEffect(() => {
    const fetchWay = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DONATION_API_URL}/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load way");

        setForm({
          bankingType: data.way.bankingType,
          cause: data.way.cause,
          useAccounts: !!data.way.accounts?.length,
          accounts: data.way.accounts?.length
            ? data.way.accounts
            : [emptyAccount()],
          accountsParagraph: data.way.accountsParagraph,
        });
        setCauseDescription(data.way.causeDescription || "");
        setAccountsParagraph(data.way.accountsParagraph || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWay();
  }, [id]);

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
      const acc = { ...next.accounts[index] };
      if (field === "bankIcon") acc.bankIcon = value;
      else (acc[field] as string) = value as string;
      next.accounts[index] = acc;
      return next;
    });
  };

  const addAccount = () =>
    setForm((p) => ({
      ...p,
      accounts: [...p.accounts, emptyAccount()],
    }));

  const removeAccount = (idx: number) =>
    setForm((p) => ({
      ...p,
      accounts: p.accounts.filter((_, i) => i !== idx),
    }));

  const onEditClick = async () => {
    const errs: FormErrors = {};
    if (!form.bankingType) errs.bankingType = "Bank Type is required";
    if (!form.cause) errs.cause = "Cause is required";
    if (!causeDescription) errs.causeDescription = "Description is required";
    if (form.useAccounts && form.accounts.length === 0)
      errs.accounts = "Add at least one account";
    if (!form.useAccounts && !accountsParagraph)
      errs.accounts = "Provide paragraph";

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
        _id: a._id,
        title: a.title,
        IBAN: a.IBAN,
        branch: a.branch,
        swift: a.swift,
        bankIcon: typeof a.bankIcon === "string" ? a.bankIcon : undefined,
      }));

      form.accounts.forEach((a) => {
        if (a.bankIcon instanceof File) {
          fd.append(`bankIcon-${a._id}`, a.bankIcon);
        }
      });

      fd.append("accounts", JSON.stringify(accountsPayload));
    } else {
      fd.append("accountsParagraph", accountsParagraph ?? "");
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DONATION_API_URL}/${id}`,
        {
          method: "PUT",
          body: fd,
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }
      router.push("/dashboard/donate/way-to-donate");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-4/5 my-10 mx-auto h-full flex flex-col gap-5">
      <Title text="Edit Way To Donate" />

      <RadioInput
        name="bankingType"
        value={form.bankingType}
        onChange={(e) =>
          setForm({ ...form, bankingType: e.target.value as BankingType })
        }
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

      <InputField
        label="Cause of Donation"
        name="cause"
        type="text"
        placeholder="Gaza Relief"
        value={form.cause}
        onChange={(e) => setForm({ ...form, cause: e.target.value })}
        error={errors.cause}
      />

      <div>
        <label className="font-semibold">Cause Description</label>
        <CkEditor
          handleOnUpdate={onCauseDescriptionChange}
          editorData={causeDescription}
          setEditorData={setCauseDescription}
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
                  name={`bankIcon-${i}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onAccountChange(i, "bankIcon", e.target.files?.[0] ?? null)
                  }
                />
                {acc.bankIcon && typeof acc.bankIcon === "string" ? (
                  <Image
                    src={acc.bankIcon}
                    alt="icon"
                    width={100}
                    height={100}
                    className="object-contain w-auto"
                  />
                ) : acc.bankIcon instanceof File ? (
                  <Image
                    src={URL.createObjectURL(acc.bankIcon)}
                    alt="preview"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                ) : null}
              </div>

              <InputField
                name="title"
                label="Title"
                type="text"
                value={acc.title}
                onChange={(e) => onAccountChange(i, "title", e.target.value)}
              />
              <InputField
                name="IBAN"
                label="IBAN"
                type="text"
                value={acc.IBAN}
                onChange={(e) => onAccountChange(i, "IBAN", e.target.value)}
              />
              <InputField
                name="branch"
                label="Branch"
                type="text"
                value={acc.branch}
                onChange={(e) => onAccountChange(i, "branch", e.target.value)}
              />
              <InputField
                name="swift"
                label="Swift"
                type="text"
                value={acc.swift}
                onChange={(e) => onAccountChange(i, "swift", e.target.value)}
              />

              <div className="mt-2 flex justify-end items-end gap-2">
                {i === form.accounts.length - 1 && (
                  <Button
                    btnText="Add Account"
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
          <label htmlFor="accountsParagraph">Accounts Detail</label>
          <CkEditor
            editorData={accountsParagraph}
            setEditorData={setAccountsParagraph}
            handleOnUpdate={onAccountsParagraphChange}
            field={"paragraph"}
          />
        </div>
      )}

      <div className="flex justify-between mt-5">
        <Button
          type="button"
          btnText="Update Way"
          onClickFunction={onEditClick}
          loading={loading}
          tertiary
        />
        <Button
          type="button"
          btnText="Cancel"
          onClickFunction={() => router.push("/dashboard/donate/way-to-donate")}
          primary
        />
      </div>
    </div>
  );
};

export default EditWay;
