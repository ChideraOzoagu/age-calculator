import { useState, useEffect } from "react";
import "./index.css";
// import { calendar } from "./calendar";

function App() {
  const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });
  const [age, setAge] = useState({ years: "--", months: "--", days: "--" });
  const [formError, setFormError] = useState({});

  // handles inputs for day, month, year
  const handleBirthDate = (e) => {
    const { name, value } = e.target;
    setBirthDate((prevBirthDate) => ({
      ...prevBirthDate,
      [name]: value,
    }));
  };

  const validateFormData = (data) => {
    const errors = {};

    const today = new Date();
    const inputDate = new Date(
      `${birthDate.year}-${birthDate.month}-${birthDate.day}`
    );

    // convert inputs to numbers
    const inputDay = parseInt(birthDate.day);
    const inputMonth = parseInt(birthDate.month);
    const inputYear = parseInt(birthDate.year);

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // check if fields are empty
    if (!data.day) {
      errors.day = "This field is required";
    } else if (data.day < 0 || data.day > 31) {
      errors.day = "Must be a valid day";
    }
    if (!data.month) {
      errors.month = "This field is required";
    } else if (data.month < 1 || data.month > 12) {
      errors.month = "Must be a valid month";
    }
    if (!data.year) {
      errors.year = "This field is required";
    } else if (inputYear > currentYear) {
      errors.year = "Must be in the past";
    }

    if (inputDate > today) {
      errors.day = "Date cannot be in the past";
    }

    // check for leap year in february
    const isLeapYear =
      (inputYear % 4 === 0 && inputYear % 100 !== 0) || inputYear % 400 === 0;
    if (inputMonth === 2 && inputDay > (isLeapYear ? 29 : 28)) {
      errors.day = "Must be a valid date";
    }

    //  check for months wwith 30 days
    if (
      (inputMonth === 4 ||
        inputMonth === 6 ||
        inputMonth === 9 ||
        inputMonth === 11) &&
      inputDay > 30
    ) {
      errors.day = "Must be a valid date";
    }

    // calculate age
    let years = currentYear - inputYear;
    let months = currentMonth - inputMonth;
    let days = currentDay - inputDay;

    if(months < 0 || (months === 0 && days< 0)) {
      years--
      months = months + 12
    } 
    if (days < 0) {
      const prevMonthLastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      months--
      days += prevMonthLastDay;
    }

    setAge({ years, months, days });

    return errors;
  };

  // handle dates submitted
  const calculateAge = (e) => {
    e.preventDefault();
    setFormError(validateFormData(birthDate));
  };
  useEffect(() => {
    if (Object.keys(formError).length === 0) {
      // form is valid, submit form
      // console.log("form data:", birthDate);
      // return birthDate
    } else {
      setAge({ ...age, years: "--", months: "--", days: "--" });
    }
  }, [formError, birthDate]);

  return (
    <>
      <div className="calculator">
        <form onSubmit={calculateAge}>
          <div className="calculator-input">
            <div>
              <label htmlFor="day">DAY</label>
              <input
                placeholder="DD"
                type="number"
                name="day"
                id="day"
                value={birthDate.day}
                onChange={handleBirthDate}
              />
              {formError.day && (
                <small className="error">{formError.day}</small>
              )}
            </div>
            <div>
              <label htmlFor="month">MONTH</label>
              <input
                placeholder="MM"
                type="number"
                name="month"
                id="month"
                value={birthDate.month}
                onChange={handleBirthDate}
              />
              {formError.month && (
                <small className="error">{formError.month}</small>
              )}
            </div>
            <div>
              <label htmlFor="year">YEAR</label>
              <input
                placeholder="YYYY"
                type="number"
                name="year"
                id="year"
                value={birthDate.year}
                onChange={handleBirthDate}
              />
              {formError.year && (
                <small className="error">{formError.year}</small>
              )}
            </div>
          </div>
          <button type="submit" className="calculate-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="44"
              viewBox="0 0 46 44"
            >
              <g fill="none" stroke="#FFF" strokeWidth="3">
                <path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44" />
              </g>
            </svg>
          </button>
        </form>
        <div className="result">
          <p className="value">
            <span>{String(age.years)}</span> years
          </p>
          <p className="value">
            <span>{String(age.months)}</span> months
          </p>
          <p className="value">
            <span>{String(age.days)}</span> days
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
