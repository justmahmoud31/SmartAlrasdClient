/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RegisterContext } from "../../Context/registerContext";
import { CiBarcode } from "react-icons/ci";
function UserData() {
  const [userData, setUserData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [pendingApprovalMessage, setPendingApprovalMessage] = useState("");
  const [noreload, setnoreload] = useState(false);
  const [labels, setLabels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  let { setidCode } = useContext(RegisterContext);
  const [first, setfirst] = useState("true");
  const [second, setsecond] = useState("true");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/users/getme`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        setUserData(res.data.user);
        setidCode(res.data.user.id);

        // console.log(res.data.user);

        setOriginalData(res.data.user);
      })
      .catch((err) => console.error("Error fetching user data", err));

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/label`)
      .then((res) => setLabels(res.data.labels))
      .catch((err) => console.error("Error fetching labels", err));
  }, []);

  const handleEdit = (field, value) => {
    setEditingField(field);
    setUpdatedValue(value || "");
    setPendingApprovalMessage("");
  };

  const handleSave = (field) => {
    if (originalData && updatedValue !== originalData[field]) {
      let updateRequest = { [field]: updatedValue };

      // If fullname, livesin, or birthdate is being edited, send for admin approval
      if (field === "fullname" || field === "livesin" || field === "birthdate") {
        updateRequest = {
          fullname: field === "livesin" || field === "birthdate" ? userData.fullname : updatedValue,
          livesin: field === "fullname" || field === "birthdate" ? userData.livesin : updatedValue,
          birthdate: field === "fullname" || field === "livesin" ? userData.birthdate : updatedValue,
        };
        setnoreload(true);
        setPendingApprovalMessage(`تم إرسال طلب تعديل ${field === "birthdate" ? "تاريخ الميلاد" : "المعلومات"}. يرجى الانتظار`);
        setEditingField(null);
      } else {
        setnoreload(false);
        setPendingApprovalMessage("تم تعديل بيانات أخرى غير الاسم الكامل أو تاريخ الميلاد. يرجى إعادة تحميل الصفحة.");
      }

      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/api/edits/addeditrequest`,
          updateRequest,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        )
        .then((res) => {
          localStorage.setItem("id", res.data.request.id);
          setUserData((prevUserData) => ({
            ...prevUserData,
            ...updateRequest,
          }));
          setOriginalData((prevOriginalData) => ({
            ...prevOriginalData,
            ...updateRequest,
          }));
          setEditingField(null);
        })
        .catch((err) => {
          console.error("Error updating user data", err);
        });
    } else {
      setEditingField(null);
    }
    setEditingField(null);
  };


  if (!userData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  //  /////////////////////////// handleImageChange
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("profilepicture", selectedImage);

    setIsUploading(true);

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/api/edits/addeditrequest`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setUserData((prev) => ({
          ...prev,
          profilepicture: selectedImage,
        }));
        window.location.reload(false);
      })
      .catch((err) => {
        console.error("Error uploading image", err);
      });

    setSelectedImage(null);
    setEditingField(null);
    setPendingApprovalMessage(`تم إرسال طلب .... يرجي الانتظار`);
    setIsUploading(false);
  };
  /////////////////////////////////////////////////////////////////
  return (
    <div className="flex min-h-screen lg:px-10">
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <img
            className="w-24 h-24 rounded-full shadow-md cursor-pointer"
            src={`${import.meta.env.VITE_BASE_URL}${userData.profilepicture}`}
            alt={userData.fullname}
            onClick={() => setIsModalOpen(true)}
          />
          <Link
            className="bg-sky-500 flex justify-center gap-1 items-center text-white py-2 px-3 rounded-lg my-2"
            to={"/generateqr"}
          >
            <CiBarcode />
          </Link>
          <h2 className="text-xl font-semibold mt-4">{userData.fullname}</h2>
          <p className="text-gray-500">{userData.jobtitle}</p>
        </div>
        {/*  */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2 text-sm "
        />
        <button
          onClick={handleUpload}
          disabled={!selectedImage || isUploading}
          className={`mt-2 px-4 py-2 rounded-lg text-white ${isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {isUploading ? "Uploading..." : "تغير الصوره "}
          <FaUpload className="inline ml-2" />
        </button>
        {/*  */}
        {/* Image Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="relative">
              <img
                className="max-w-full max-h-[90vh] rounded-lg"
                src={`${import.meta.env.VITE_BASE_URL}${userData.profilepicture
                  }`}
                alt={userData.fullname}
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking image
              />
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {/* fullname */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "fullname" ? (
              <span className="font-bold text-gray-500">اسم المستخدم :</span>
            ) : (
              ""
            )}
            {editingField === "fullname" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.fullname || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() =>
                editingField === "fullname"
                  ? handleSave("fullname")
                  : handleEdit("fullname", userData.fullname)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "fullname" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "email" ? (
              <span className="font-bold text-gray-500">
                البريد الالكتروني:
              </span>
            ) : (
              ""
            )}
            {editingField === "email" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.email || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() =>
                editingField === "email"
                  ? handleSave("email")
                  : handleEdit("email", userData.email)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "email" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* Phone Number */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "phonenumber" ? (
              <span className="font-bold text-gray-500">رقم الهاتف:</span>
            ) : (
              ""
            )}
            {editingField === "phonenumber" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.phonenumber || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() =>
                editingField === "phonenumber"
                  ? handleSave("phonenumber")
                  : handleEdit("phonenumber", userData.phonenumber)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "phonenumber" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* birthdate */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "birthdate" ? (
              <span className="font-bold text-gray-500"> تاريخ الميلاد :</span>
            ) : (
              ""
            )}
            {editingField === "birthdate" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {new Date(userData.birthdate).toLocaleDateString("ar-EG") ||
                  "غير متوفر"}
              </span>
            )}
            <button
              onClick={() =>
                editingField === "birthdate"
                  ? handleSave("birthdate")
                  : handleEdit("birthdate", userData.birthdate)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "birthdate" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* jobtitle */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "jobtitle" ? (
              <span className="font-bold text-gray-500">
                {" "}
                {labels.length > 0
                  ? labels[0].label + " : "
                  : ": المسمى الوظيفي :"}
              </span>
            ) : (
              ""
            )}
            {editingField === "jobtitle" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">{userData.jobtitle}</span>
            )}
            {/* <button
              onClick={() =>
                editingField === "jobtitle"
                  ? handleSave("jobtitle")
                  : handleEdit("jobtitle", userData.jobtitle)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "jobtitle" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button> */}
          </div>

          {/* livesin */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "livesin" ? (
              <span className="font-bold text-gray-500"> محل الولادة:</span>
            ) : (
              ""
            )}
            {editingField === "livesin" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.livesin || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() =>
                editingField === "livesin"
                  ? handleSave("livesin")
                  : handleEdit("livesin", userData.livesin)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "livesin" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* height */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "height" ? (
              <span className="font-bold text-gray-500">
                {" "}
                {labels.length > 0 ? labels[1].label + " : " : "الطول :"}
              </span>
            ) : (
              ""
            )}
            {editingField === "height" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">{userData.height}</span>
            )}
            {/* <button
              onClick={() =>
                editingField === "height"
                  ? handleSave("height")
                  : handleEdit("height", userData.height)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "height" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button> */}
          </div>

          {/* status */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField !== "status" && (
              <span className="font-bold text-gray-500"> الحالة :</span>
            )}
            {editingField === "status" ? (
              <select
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              >
                <option value="">اختر الحالة</option>
                <option
                  className="text-green-900"
                  value={labels.length > 0 ? labels[2].label : "يعمل"}
                >
                  <span className="text-green-900">
                    {labels.length > 0 ? labels[2].label : "يعمل"}
                  </span>
                </option>
                <option
                  className="text-red-600"
                  value={labels.length > 0 ? labels[3].label : "لا يعمل"}
                >
                  <span className="text-red-600">
                    {labels.length > 0 ? labels[3].label : "يعمل"}
                  </span>
                </option>
              </select>
            ) : userData.status == labels[2].label ? (
              <span className="text-green-900">{userData.status}</span>
            ) : (
              <span className="text-red-600">{userData.status}</span>
            )}

            <button
              onClick={() =>
                editingField === "status"
                  ? handleSave("status")
                  : handleEdit("status", userData.status)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "status" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button>
          </div>

          {/* privatenumber */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingField != "privatenumber" ? (
              <span className="font-bold text-gray-500"> الرقم الخاص :</span>
            ) : (
              ""
            )}
            {editingField === "privatenumber" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">{userData.privatenumber}</span>
            )}
            {/* <button
              onClick={() =>
                editingField === "privatenumber"
                  ? handleSave("privatenumber")
                  : handleEdit("privatenumber", userData.privatenumber)
              }
              className="ml-2 text-blue-500"
            >
              {editingField === "privatenumber" ? (
                <div className="text-green-500">
                  <FaSave />
                </div>
              ) : (
                <FaEdit />
              )}
            </button> */}
          </div>
        </div>

        {/* line */}
        <div className="my-10 border-2 "></div>

        {/* AtherData */}
        <div>
          <p className="text-gray-700 font-bold text-2xl">بيانات اضافية :</p>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {/* brothernumber */}
          <div className="flex justify-between items-center  bg-gray-50 p-4 rounded-lg shadow-sm">
            {/* {editingField != "brothernumber" && userData.brothernumber ? (
              <span className="font-bold text-gray-500"></span>
            ) : (
              ""
            )} */}
            {editingField === "brothernumber" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.brothernumber || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() => {
                setfirst(!first);
                editingField === "brothernumber"
                  ? handleSave("brothernumber")
                  : handleEdit("brothernumber", userData.brothernumber);
              }}
              className="ml-2 text-blue-500"
            >
              {first ?
                <FaEdit />
                :
                <div className="text-green-500">
                  <FaSave />
                </div>
              }
            </button>
          </div>

          {/* fathernumber */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            {/* {editingField != "fathernumber" && userData.fathernumber ? (
              <span className="font-bold text-gray-500"></span>
            ) : (
              ""
            )} */}
            {editingField === "fathernumber" ? (
              <input
                type="text"
                className="text-black px-2 py-1 rounded-md w-full"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
              />
            ) : (
              <span className="text-black">
                {userData.fathernumber || "غير متوفر"}
              </span>
            )}
            <button
              onClick={() => {
                setsecond(!second);
                editingField === "fathernumber"
                  ? handleSave("fathernumber")
                  : handleEdit("fathernumber", userData.fathernumber)
              }}
              className="ml-2 text-blue-500"
            >
              {second ?
                <FaEdit />
                :
                <div className="text-green-500">
                  <FaSave />
                </div>
              }
            </button>
          </div>
        </div>

        {pendingApprovalMessage && (
          <div className="mt-4 p-3 bg-yellow-200 text-yellow-800 text-center rounded-md">
            {pendingApprovalMessage}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to={`/confirmusercode`}
            className={noreload ? "py-1 px-2 rounded-md bg-green-500 hover:bg-green-600" : "hidden"}
          >
            تحقق بالكود
          </Link>
        </div>

      </div>
    </div>
  );
}

export default UserData;
