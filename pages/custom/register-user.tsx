import React, { ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { BsExclamationCircle } from "react-icons/bs";
import axios from "redaxios";
import Image from "next/image";

export default function StaffRegistration() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState({});

  function nextStep() {
    setStep(step + 1);
  }

  switch (step) {
    case 0:
      return <Form setUser={setUser} nextStep={nextStep} />;
      break;
    case 1:
      return <AvatarUpload user={user} nextStep={nextStep} />;
      break;
    case 2:
      return <Success />;
      break;
    default:
      break;
  }
}

function Success() {
  return (
    <div className="h-screen bg-gray-100">
      <div className="p-6 bg-white md:mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="w-16 h-16 mx-auto my-6 text-green-600"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="text-base font-semibold text-center text-gray-900 md:text-2xl">
            Registration Completed!
          </h3>
          <p className="my-2 text-gray-600">
            Thank you for completing your registration. You will be notified
            when website is ready.
          </p>
          <p> Have a great day!</p>
          <div className="py-10 text-center"></div>
        </div>
      </div>
    </div>
  );
}

export function AvatarUpload({
  user,
  nextStep,
}: {
  user: { [key: string]: any };
  nextStep: () => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadToServer = async () => {
    setLoading(true);
    const body = new FormData();
    if (!image) return;
    body.append("file", image);
    const response = await fetch("/api/media/upload", {
      method: "POST",
      body,
    });
    const data = await response.json();
    console.log(user);
    console.log("USER OBJECT");
    const res = await axios.post("/api/users/avatar-upload", {
      key: user.key,
      avatar: data.url,
    });
    if (res.status === 200) {
      nextStep();
    }
  };

  const uploadToClient: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  return (
    <Wrapper
      title="Upload your photo"
      subtitle="Please upload a nice photo to display on website"
    >
      <div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover photo
          </label>
          {createObjectURL && (
            <Image
              src={createObjectURL}
              width={250}
              height={250}
              alt="sample"
            />
          )}
          <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={uploadToClient}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        <div className="mt-3 text-right md:col-span-5">
          <div className="inline-flex items-center">
            {loading && (
              <p className="mx-2 font-bold text-blue-600 animation animate-pulse">
                Loading...
              </p>
            )}
            <input
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              type="submit"
              disabled={loading}
              onClick={uploadToServer}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

type Dt = {
  facebook: string;
  instagram: string;
  linkedin: string;
  phone: string;
};

export function Form({
  setUser,
  nextStep,
}: {
  setUser: (user: any) => void;
  nextStep: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const toSubmit = {
      ...data,
      password: "faculty@123",
      role: ["staff"],
      socialLinks: {
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
        whatsapp: data.phone,
      },
    };
    console.log(toSubmit);
    const res = await axios.post(
      "/api/users/register",
      toSubmit
    );
    if (res.status === 200) {
      console.log("Success");
      setUser(res.data.data);
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Wrapper title="Personal Details" subtitle="Please fill out all fields">
        <InputItem title="Full Name" span="5">
          <input
            type="text"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Full Name"
            {...register("name", {
              required: "This field is required!",
              min: { value: 3, message: "Min 3 characters" },
              maxLength: { value: 20, message: "Max 20 characters" },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Email" span="5">
          <input
            type="text"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Email"
            {...register("email", {
              required: "This field is required!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Mobile Number" span="5">
          <input
            type="tel"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Mobile number"
            {...register("phone", {
              required: "This field is required!",
              minLength: { value: 10, message: "Invalid Mobile Number" },
              maxLength: { value: 10, message: "Invalid Mobile Number" },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Address" span="5">
          <textarea
            {...register("address", {
              required: "This field is required!",
              minLength: { value: 10, message: "Invalid Address" },
            })}
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
          />
          <ErrorMessage
            errors={errors}
            name="address"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Department / Section" span="5">
          <select
            {...register("department", {
              required: "This field is required!",
            })}
            className="w-full px-4 text-gray-800 bg-transparent rounded-md shadow-sm outline-none appearance-none"
          >
            <option value="Electronics Dept">Electronics Dept</option>
            <option value="Electrical Dept"> Electrical Dept</option>
            <option value="Mechanical Dept"> Mechanical Dept</option>
            <option value="Civil Dept"> Civil Dept</option>
            <option value="General Dept"> General Dept</option>
            <option value="Office Section"> Office Section</option>
            <option value="General Workshop">General Workshop</option>
          </select>
          <ErrorMessage
            errors={errors}
            name="department"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Designation" span="5">
          <input
            type="text"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Designation"
            {...register("designation", {
              required: "This field is required!",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="designation"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Facebook Link" optional span="5">
          <input
            type="url"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Facebook Link"
            {...register("facebook", {
              required: false,
              pattern: {
                value: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
                message: "Invalid Facebook Link",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="facebook"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="Instagram Link" optional span="5">
          <input
            type="url"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="Instagram Link"
            {...register("instagram", {
              required: false,
              pattern: {
                value: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
                message: "Invalid Instagram Link",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="instagram"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <InputItem title="LinkedIn Link" optional span="5">
          <input
            type="url"
            className="w-full h-10 px-4 mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50"
            placeholder="LinkedIn Link"
            {...register("linkedin", {
              required: false,
              pattern: {
                value: /^(http(s)?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/i,
                message: "Invalid Link",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="linkedin"
            render={({ message }) => <ErrorMessageComp message={message} />}
          />
        </InputItem>
        <div className="mt-3 text-right md:col-span-5">
          <div className="inline-flex items-center">
            <input
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              type="submit"
            />
          </div>
        </div>
      </Wrapper>
    </form>
  );
}

function Wrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex justify-center min-h-screen p-6 bg-gray-100">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <h2 className="text-xl font-semibold text-gray-600">
            Data for GPTC Perinthalmanna Website
          </h2>
          <p className="mb-6 text-gray-500">
            Hello. This form is made to collect data for adding staff details on
            website. Kindly fill all the data possible to make your profile
            complete.
          </p>

          <div className="p-4 px-4 mb-6 bg-white rounded shadow-lg md:p-8">
            <div className="grid grid-cols-1 gap-4 text-sm gap-y-2 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="text-lg font-medium">{title}</p>
                <p>{subtitle}</p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 text-sm gap-y-2 md:grid-cols-5"></div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputItem({
  children,
  title,
  span,
  optional,
}: {
  children: React.ReactNode;
  title: string;
  span: string;
  optional?: boolean;
}) {
  let className = "";
  if (span === "5") {
    className = "md:col-span-5";
  } else if (span === "4") {
    className = "md:col-span-4";
  } else if (span === "3") {
    className = "md:col-span-3";
  } else if (span === "2") {
    className = "md:col-span-2";
  } else if (span === "1") {
    className = "md:col-span-1";
  } else {
    className = "md:col-span-1";
  }

  return (
    <div className={"mt-3 " + className}>
      <label>
        {title}{" "}
        {optional && <span className="ml-2 text-green-600">Optional</span>}
      </label>
      {children}
    </div>
  );
}

function ErrorMessageComp({ message }: { message: string }) {
  return (
    <p className="flex items-center pt-2 mx-2 text-sm text-red-500">
      <BsExclamationCircle color="red" className="mr-2" />
      {message}
    </p>
  );
}
