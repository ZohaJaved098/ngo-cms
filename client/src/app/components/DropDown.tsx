"use client";
import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { InputField } from "./InputField";
import { Button } from "./Button";

type DropDownProps = {
  wayId: string;
  cause: string;
  amount: number;
  onAdd: (wayId: string, amount: number) => void;
  onRemove: (wayId: string) => void;
};

const DropDown = ({ wayId, cause, amount, onAdd, onRemove }: DropDownProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [localAmount, setLocalAmount] = useState(amount);

  return (
    <div className="flex flex-col my-10">
      <div
        className="flex justify-between items-center "
        onClick={() => setIsOpened(!isOpened)}
      >
        <h3 className="text-xl font-semibold capitalize text-gray-700">
          {cause}
        </h3>

        {isOpened ? (
          <TiArrowSortedUp className="text-gray-700 w-8 h-8" />
        ) : (
          <TiArrowSortedDown className="text-gray-700 w-8 h-8" />
        )}
      </div>

      {isOpened && (
        <div className="flex justify-between items-center gap-10 mt-3">
          <div className="w-1/2">
            <InputField
              label="Enter Amount to Donate"
              name="amount"
              type="number"
              value={localAmount}
              onChange={(e) => setLocalAmount(Number(e.target.value))}
            />
          </div>
          <div className="w-1/2 flex flex-col items-end gap-5">
            <p className="text-gray-800 text-lg text-left font-semibold ">
              Amount: {localAmount}
            </p>
            <div className="flex gap-2">
              <Button
                btnText="Add"
                type="button"
                onClickFunction={() => onAdd(wayId, localAmount)}
                primary
                className="max-w-32 "
              />
              <Button
                btnText="Remove"
                type="button"
                onClickFunction={() => onRemove(wayId)}
                secondary
                className="max-w-32 "
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
