  'use client'

  import React, { useState, useRef, useEffect } from "react";
  import jsPDF from "jspdf";
  import html2canvas from "html2canvas";
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { FaCrown } from "react-icons/fa6";

  enum PlanType {
    Basic = "Basic",
    Standard = "Standard",
    Advance = "Advance",
    Premium = "Premium",
    Vip = "Vip",
    Addons = "Addons",
  }

  type CheckedOptionsByPlanType = {
    [planId: string]: boolean;
  };

  type CheckedOptionsById = {
    [addonId: string]: boolean;
  };

  type CheckedOptions = CheckedOptionsByPlanType & CheckedOptionsById;

  type Plan = {
    id: number;
    type: PlanType;
    serviceTitle: string;
    description: string;
    price: number;
  };

  const Quotation = () => {
    const [checkedOptions, setCheckedOptions] = useState<CheckedOptions>({});
    const [addons, setAddons] = useState<Plan[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    // const [showAddons, setShowAddons] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState("");
    const [total, setTotal] = useState<number>(0);
    const [isSending, setIsSending] = useState(false);


    const isAnyOptionSelected = Object.values(checkedOptions).some((isChecked) => isChecked);

    const fetchPlans = async (type?: PlanType) => {
      const query = type ? `?type=${type}` : "";
      const response = await fetch(`/api/quote${query}`);
      const data = await response.json();
      if (type === PlanType.Addons) setAddons(data);
      else setPlans(data);
      return data;
    };

    const handleCheckboxChange = async (option: PlanType) => {
      setCheckedOptions((prevCheckedOptions) => {
        const newCheckedOptions = { ...prevCheckedOptions };

        if (option !== PlanType.Addons) {
          Object.keys(newCheckedOptions).forEach((key) => {
            if (key !== PlanType.Addons) {
              newCheckedOptions[key as PlanType] = false;
            }
          });
        }

        newCheckedOptions[option] = !prevCheckedOptions[option];

        return newCheckedOptions;
      });

      if (!checkedOptions[option]) {
        await fetchPlans(option);
      } else {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.type !== option));
      }
    };

    const handleCheckboxChangeInTable = (id: number) => {
      setCheckedOptions((prevCheckedOptions) => {
        const newCheckedOptions = { ...prevCheckedOptions };
        newCheckedOptions[id.toString()] = !prevCheckedOptions[id.toString()];
        return newCheckedOptions;
      });
    };

    useEffect(() => {
      setTotal(calculateTotal());
    }, [checkedOptions, plans, addons]);

    const options: PlanType[] = [
      PlanType.Basic,
      PlanType.Standard,
      PlanType.Advance,
      PlanType.Premium,
      PlanType.Vip,
    ];

    const calculateTotal = () => {
      let total = 0;

      plans.forEach((plan) => {
        if (checkedOptions[plan.id.toString()] ?? checkedOptions[plan.type] ?? true) {
          total += plan.price;
        }
      });

      addons.forEach((addon) => {
        if (checkedOptions[addon.id.toString()] ?? false) {
          total += addon.price;
        }
      });

      return total;
    };
    const downloadPDF = () => {
      // Log selected details
      console.log("Selected Options: ");
      plans.forEach((plan) => {
        if (checkedOptions[plan.id.toString()] ?? checkedOptions[plan.type]) {
          console.log(`Plan: ${plan.serviceTitle}`);
          console.log(`Description: ${plan.description}`);
          console.log(`Price: ₱${plan.price}`);
        }
      });
    
      addons.forEach((addon) => {
        if (checkedOptions[addon.id.toString()]) {
          console.log(`Addon: ${addon.serviceTitle}`);
          console.log(`Description: ${addon.description}`);
          console.log(`Price: ₱${addon.price}`);
        }
      });
    
      if (componentRef.current) {
        html2canvas(componentRef.current, {
          useCORS: true,
          logging: false,
          scale: 2,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png", 1.0);
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
          pdf.setFont("times", "normal");
          pdf.setFontSize(22);
          pdf.text("Quotation", pdfWidth / 2 + 15, 30, { align: "center" });
    
          pdf.setFontSize(12);
          pdf.text("Date: " + new Date().toLocaleDateString(), pdfWidth - 30, 40, { align: "right" });
    
          pdf.setLineWidth(0.5);
          pdf.line(10, 50, pdfWidth + 20, 50);
          pdf.setLineWidth(0.1);
    
          pdf.addImage(imgData, "PNG", 15, 60, pdfWidth, pdfHeight);
    
          pdf.save("quotation.pdf");
        });
      }
    };
    

    const sendEmail = async () => {
      if (componentRef.current) {
        setIsSending(true);
        html2canvas(componentRef.current, {
          useCORS: true,
          logging: false,
          scale: 2,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png", 1.0);
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.setFont("times", "normal");
          pdf.setFontSize(22);
          pdf.text("Quotation", pdfWidth / 2 + 15, 30, { align: "center" });

          pdf.setFontSize(12);
          pdf.text("Date: " + new Date().toLocaleDateString(), pdfWidth - 30, 40, { align: "right" });

          pdf.setLineWidth(0.5);
          pdf.line(10, 50, pdfWidth + 20, 50);
          pdf.setLineWidth(0.1);

          pdf.addImage(imgData, "PNG", 15, 60, pdfWidth, pdfHeight);

          const pdfData = pdf.output("datauristring");

          try {
            const response = await fetch('/api/quote-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, pdfData }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            toast.success(data.message);
          } catch {
            toast.error("There was an issue sending the email.");
          } finally {
            setIsSending(false);
          }

          pdf.save("quotation.pdf");
        });
      }
    };

    return (
      <div ref={componentRef} className="p-6 bg-white rounded-lg shadow-lg mx-4 sm:mx-8 md:mx-20">
        <ToastContainer autoClose={1500} />
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Customize Your Service Features to Fit Your Budget</h3>
        <p className="text-gray-600 mb-4">At Infinitech, we provide flexible options that allow you to customize various features of our services.</p>

        <div className="flex flex-col justify-end sm:flex-row gap-4 mb-6">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto text-sm"
          />
          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            disabled={isSending}
          >
            {isSending && <span className="animate-spin h-4 w-4 border-t-2 rounded-lg border-white border-solid mr-2"></span>}
            Send Result via Email
          </button>

          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto text-sm"
          >
            Download PDF
          </button>
        </div>

        <div className="mt-4 text-right sm:mx-8 md:mx-20 ">
          <span className="text-xl font-bold text-gray-800">Total: ₱{total.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 sm:mx-8 md:mx-20">
          {options.map((option) => (
            <div
              key={option}
              className="flex flex-col items-center p-4 border rounded-lg shadow-sm w-full mb-4 sm:mb-0"
            >
              <div className="flex items-center mb-2">
                <input
                  id={option}
                  type="checkbox"
                  checked={checkedOptions[option] ?? false}
                  onChange={() => handleCheckboxChange(option)}
                  className="w-5 h-5 text-blue-500 mr-2"
                />
                <label htmlFor={option} className="font-semibold text-blue-600 flex items-center">
                  {option === "Premium" || option === "Vip" ? (
                    <>
                      {option}
                      <FaCrown className="ml-1 text-black" />
                    </>
                  ) : (
                    option
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-500">15 in 1</p>
            </div>
          ))}
        </div>

        {isAnyOptionSelected && (
          <div className="mx-4 sm:mx-8 md:mx-20">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border border-gray-300">Service</th>
                  <th className="text-left py-2 px-4 border border-gray-300">Description</th>
                  <th className="text-left py-2 px-4 border border-gray-300">Price</th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-gray-300">
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="checkbox"
                          className="mr-3 w-4 h-4 text-blue-500"
                          checked={checkedOptions[plan.id.toString()] ?? checkedOptions[plan.type] ?? true}
                          onChange={() => handleCheckboxChangeInTable(plan.id)}
                        />
                        <span className="font-medium text-gray-800">{plan.serviceTitle}</span>
                      </td>
                      <td className="py-2 px-4 text-gray-600 border border-gray-300">{plan.description}</td>
                      <td className="py-2 px-4 text-gray-700 border border-gray-300">₱{plan.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 text-gray-600 text-center border border-gray-300">
                      No plans available for selected types.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  export default Quotation;