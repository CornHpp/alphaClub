import { useState } from "react";
import { Input, Popup } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import Picker from "react-mobile-picker";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import Button from "../ui/button";
import { RootState } from "@/redux/type";
import { UserStateType } from "@/redux/features/userSlice";

export const getNumberOfDaysInMonth = (config?: {
  givenYear?: number;
  // Given month, start from 1
  givenMonth?: number;
}) => {
  const date = new Date();
  const year = config?.givenYear ?? date.getFullYear();
  const month = config?.givenMonth ?? date.getMonth() + 1;
  return new Date(year, month, 0).getDate();
};

const generateStrNumberArray = ({
  start,
  end,
  predicate,
  interval = 1,
}: {
  start: number;
  end?: number;
  predicate?: (x: number) => boolean;
  interval?: number;
}) => {
  const len = typeof end !== "undefined" ? end - start + 1 : start;
  return new Array(len)
    .fill(null)
    .map((_, i) => (i + (typeof end !== "undefined" ? start : 0)) * interval)
    .filter((x) => predicate?.(x) ?? true)
    .map((x) => x.toString().padStart(2, "0"));
};

const getPickerSelections = (
  hourLimit: number,
  nowDate?: Date,
  givenTime?: number,
) => {
  // filter conditions
  const givenDate = givenTime ? new Date(givenTime) : undefined;
  const givenMonth = givenDate ? givenDate.getMonth() : undefined;
  const numberOfDate = getNumberOfDaysInMonth({
    givenMonth: givenMonth,
  });
  const now = nowDate ?? new Date();
  const isCurrentMonth = givenDate && givenMonth === now.getMonth();
  const isSameDay = isCurrentMonth && now.getDate() === givenDate.getDate();
  const isSameHour =
    isCurrentMonth && isSameDay && now.getHours() === givenDate.getHours();

  return {
    year: [now.getFullYear().toString()],
    month: generateStrNumberArray({
      start: 1,
      end: 12,
      // Months should be filtered after current month inclusive
      predicate: (x) => x - 1 >= now.getMonth(),
    }),
    date: generateStrNumberArray({
      start: 1,
      end: numberOfDate,
      predicate: (x) => (isCurrentMonth ? x >= now.getDate() : true),
    }),
    hour: generateStrNumberArray({
      start: 24,
      predicate: (x) => (isSameDay ? x >= now.getHours() + hourLimit : true),
    }),
    minute: generateStrNumberArray({
      start: 0,
      end: 3,
      interval: 15,
      predicate: (x) => (isSameHour ? x >= now.getMinutes() : true),
    }),
  } as const;
};

// Returns a default begin time value base on now + 2h
export const getInitialDefaultValue = () => {
  const now = new Date();
  const year = now.getFullYear().toString().padStart(2, "0");
  const minute = "00";
  const hour = (now.getHours() + 2).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  // Month is 0 based
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  return {
    year,
    month,
    date,
    hour,
    minute,
  };
};

export type PickerType = Record<
  keyof ReturnType<typeof getPickerSelections>,
  string
>;

export interface TimePickerProps {
  placeholder?: string;
  onSelectTime?: (time: string) => void;
  value: PickerType;
  disabled?: boolean;
  hourLimit?: number;
  startingTime?: Date;
}

export function TimePicker({
  value,
  placeholder,
  onSelectTime,
  disabled,
  hourLimit,
  startingTime,
}: TimePickerProps) {
  const [pickerValue, setPickerValue] = useState<PickerType>(value);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { year, month, date, hour, minute } = pickerValue;
  const time = new Date(
    `${year}-${month}-${date} ${hour}:${minute}:00`,
  ).getTime();
  const selections = getPickerSelections(hourLimit ?? 1, startingTime, time);
  const { isMobile } = useSelector<RootState, UserStateType>((x) => x.user);

  return (
    <>
      <Input
        onFocus={() => (isMobile ? setIsPickerVisible(true) : null)}
        value={`${year}-${month}-${date} ${hour}:${minute}:00`}
        placeholder={placeholder ?? "Please select a time"}
        type={isMobile ? "text" : "datetime-local"}
        disabled={disabled}
      />

      <Popup
        visible={isPickerVisible}
        onMaskClick={() => setIsPickerVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <div className="flex justify-center py-4 relative">
          <h4 className="text-[rgb(51,_51,_51)] text-base">Select Date</h4>

          <button
            className="absolute right-4"
            onClick={() => setIsPickerVisible(false)}
          >
            <CloseOutline
              className="w-6 h-6"
              strokeWidth={3}
            />
          </button>
        </div>

        <div className="flex justify-center pt-12">
          {Object.keys(selections).map((name: string) => (
            <p
              className="flex-1 text-center text-[rgb(153,_153,_153)] text-sm capitalize"
              key={name}
            >
              {name}
            </p>
          ))}
        </div>
        <Picker
          value={pickerValue}
          onChange={setPickerValue}
          height={280}
          wheelMode="normal"
        >
          {Object.keys(selections).map((name: string) => (
            <Picker.Column
              name={name}
              key={name}
            >
              {selections[name as keyof typeof selections].map((option) => (
                <Picker.Item
                  key={option}
                  value={option}
                >
                  <span
                    className={cn(
                      "text-base",
                      pickerValue[name as keyof typeof selections] === option
                        ? "text-black"
                        : "text-gray-400",
                    )}
                  >
                    {option}
                  </span>
                </Picker.Item>
              ))}
            </Picker.Column>
          ))}
        </Picker>

        <div className="px-4 pt-6 pb-4 pb-12">
          <Button
            height="42px"
            onClick={() => {
              if (disabled) {
                return;
              }
              onSelectTime?.(`${year}-${month}-${date} ${hour}:${minute}:00`);
              setIsPickerVisible(false);
            }}
          >
            Determine
          </Button>
        </div>
      </Popup>
    </>
  );
}
