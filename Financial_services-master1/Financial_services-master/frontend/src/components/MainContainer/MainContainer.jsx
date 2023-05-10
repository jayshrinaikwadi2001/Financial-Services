import React, { useState } from "react";
import style from "./mainContainer.module.css";
import InputMask from "react-input-mask";
import { FaGreaterThan } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseUrl } from "../constants";
import Spinners from "../Spinners";
const MainContainer = () => {
  const [asideClick, setAsideClick] = useState("open_account");
  const [dashBoardSelection, setDashboardSelection] = useState("submited");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchDraftedData, setFetchDraftedData] = useState([]);
  const [fetchSubmitedData, setFetchSubmitedData] = useState([]);
  const [viewApplicationData, setViewApplicatoinData] = useState({});
  const [viewApplication, setViewApplication] = useState(false);
  const loggedInUser = localStorage.getItem("user");
  const user = JSON.parse(loggedInUser);
  const userId = user._id;

  const [formData, setFormData] = useState({
    relationshipManagerName: "",
    relationshipManagerId: "",
    customerName: "",
    address: "",
    pan: "",
    adharNumber: "",
    dob: "",
    email: "",
    phoneNumber: "",
    products: [],
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleProductSelection = (event) => {
    const option = event.target.value;
    console.log(option);
    if (formData.products.includes(option)) {
      setFormData({
        ...formData,
        products: formData.products.filter(
          (selectedOption) => selectedOption !== option
        ),
      });
    } else {
      setFormData({
        ...formData,
        products: [...formData.products, option],
      });
    }
  };

  const handleFormSaveData = async () => {
    setAsideClick("product_selection");
  };

  const handleMoveToSummary = async () => {
    setAsideClick("summary_page");
  };

  const handleSaveAsDraft = async () => {
    formData.relationshipManagerId = userId;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${baseUrl}/application/draft`,
        formData,
        config
      );
      if (response.status === 200) {
        toast.success("Saved As Drafted");
      } else {
        toast.error("Error While drafting Application");
      }
      setFormData({
        relationshipManagerName: "",
        customerName: "",
        address: "",
        pan: "",
        adharNumber: "",
        dob: "",
        email: "",
        phoneNumber: "",
        products: [],
      });
      setAsideClick("open_account");
    } catch (err) {
      console.log("error in saving draft");
      toast.error("Error While drafting Application");
    }
  };
  const handleApplicationSubmit = async () => {
    console.log("formData", formData);
    formData.relationshipManagerId = userId;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${baseUrl}/application/submit`,
        formData,
        config
      );
      if (response.status === 200) {
        toast.success("Submited Successfully");
      } else {
        toast.error("Error In Submitting");
      }
      setFormData({
        relationshipManagerName: "",
        customerName: "",
        address: "",
        pan: "",
        adharNumber: "",
        dob: "",
        email: "",
        phoneNumber: "",
        products: [],
      });
      setAsideClick("open_account");
      handleDashboardClick();
    } catch (err) {
      console.log("error in saving draft");
      toast.error("Error While cathing");
    }
  };

  const handleDashboardClick = async () => {
    setAsideClick("dashboard");
    setIsLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (user.isOperationalManager === false) {
        const draftResponse = await axios.get(
          `${baseUrl}/application/fetchDraft/${userId}`,
          config
        );

        const submitedResponse = await axios.get(
          `${baseUrl}/application/fetchSubmited/${userId}`,
          config
        );

        if (draftResponse.status === 200 && submitedResponse.status === 200) {
          // console.log(draftResponse.data);
          setFetchDraftedData(draftResponse.data);
          setFetchSubmitedData(submitedResponse.data);
        } else {
          toast.error("Fething data is failed");
        }
      } else {
        const fetchSubmitedApplication = await axios.get(
          `${baseUrl}/application/fetchApplication`,
          config
        );

        if (fetchSubmitedApplication.status === 200) {
          setFetchSubmitedData(fetchSubmitedApplication.data);
        } else {
          toast.error("Error in fetching data");
        }
      }
    } catch (err) {
      console.err("error in loading a sumited status");
    }
    setIsLoading(false);
    setDashboardSelection("drafted");
  };

  const handleViewApplication = (application) => {
    console.log("view App" + application);
    // console.log(application.relationshipManagerName);
    setViewApplicatoinData(application);
    console.log(viewApplicationData.relationshipManagerId);
    setViewApplication(true);
  };

  const handleApplicationResponse = async (request, applicationId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        relationshipMangerId: userId,
        applicationId,
      };
      if (request === "Accept") {
        const acceptRequestResponse = await axios.put(
          `${baseUrl}/application/accept`,
          data,
          config
        );
        if (acceptRequestResponse.status === 200) {
          toast.success("Application Accepted Successfully");
          setViewApplication(false);
        } else {
          toast.error("Something Went Wrong");
        }
      } else {
        const acceptRequestResponse = await axios.put(
          `${baseUrl}/application/reject`,
          data,
          config
        );
        if (acceptRequestResponse.status === 200) {
          toast.success("Application Reject Successfully");
          setViewApplication(false);
        } else {
          toast.error("Something Went Wrong");
        }
      }
      handleDashboardClick();
    } catch (error) {
      console.log("Error in handeling Reponse");
      toast.error("Reponse not processed");
    }
  };

  return (
    <div className={style.mainContaintContainer}>
      <div className={style.asideContainer}>
        <div
          className={style.asideOptionWrapper}
          onClick={() => setAsideClick("open_account")}
        >
          <span className={style.asideOptionsHeading}> Open Account</span>
        </div>
        <div
          className={style.asideOptionWrapper}
          onClick={handleDashboardClick}
        >
          <span className={style.asideOptionsHeading}> Dashboard</span>
        </div>
      </div>
      <div className={style.mainFeedContainer}>
        {asideClick === "open_account" && (
          <>
            <div className={style.openingAccountFormWrapper}>
              <div className={style.accountDetailsWrapper}>
                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>
                      Relationship Manager Name:
                    </span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="text"
                      name="relationshipManagerName"
                      value={formData.relationshipManagerName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>Customer Name:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>Address:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>PAN:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>Adhar Number:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <InputMask
                      mask="9999 9999 9999"
                      name="adharNumber"
                      value={formData.adharNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>DOB:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}> Email:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={style.inputFeildWrapper}>
                  <div className={style.inputlableWrapper}>
                    <span className={style.labelStyle}>Phone Number:</span>
                  </div>
                  <div className={style.inputWrapper}>
                    <InputMask
                      mask="+91 99999 99999"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className={style.navigationWrapper}>
                <div className={style.footerNavigationLeft}></div>
                <div className={style.footerNavigationRight}>
                  <button
                    className={style.nextButton}
                    onClick={handleFormSaveData}
                  >
                    move to product selection
                    <FaGreaterThan className={style.logoStyle} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {asideClick === "product_selection" && (
          <>
            <div className={style.productSelectionContainer}>
              <div className={style.producutListWrapper}>
                <div className={style.productListHeading}>Select Products:</div>
                <div className={style.productList}>
                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Saving Account with minimum 10k"
                        onChange={handleProductSelection}
                      />
                      Saving Account with minimum 10k
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Premium Saving Account with minimum 80K"
                        onChange={handleProductSelection}
                      />
                      Premium Saving Account with minimum 80K
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Salary Account"
                        onChange={handleProductSelection}
                      />
                      Salary Account
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Student Account"
                        onChange={handleProductSelection}
                      />
                      Student Account
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Minor Account"
                        onChange={handleProductSelection}
                      />
                      Minor Account
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Current Account"
                        onChange={handleProductSelection}
                      />
                      Current Account
                    </label>
                  </div>

                  <div className={style.productWrapper}>
                    <label>
                      <input
                        className={style.productCheckBox}
                        type="checkbox"
                        value="Special Pension Scheme"
                        onChange={handleProductSelection}
                      />
                      Special Pension Scheme
                    </label>
                  </div>
                </div>
              </div>
              <div className={style.navigationWrapper}>
                <div className={style.footerNavigationLeft}></div>
                <div className={style.footerNavigationRight}>
                  <button
                    className={style.nextButton}
                    onClick={handleMoveToSummary}
                  >
                    move to summary
                    <FaGreaterThan className={style.logoStyle} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {asideClick === "summary_page" && (
          <>
            <div className={style.summaryContainer}>
              <div className={style.summaryTableWrapper}>
                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>
                      Relationship Manager Name
                    </span>
                  </div>
                  <div className={style.tableFeildValue}>
                    {formData.relationshipManagerName}
                  </div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>
                      Customer Name
                    </span>
                  </div>
                  <div className={style.tableFeildValue}>
                    {formData.customerName}
                  </div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>Address</span>
                  </div>
                  <div className={style.tableFeildValue}>
                    {formData.address}
                  </div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>PAN</span>
                  </div>
                  <div className={style.tableFeildValue}>{formData.pan}</div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>
                      Adhar Number
                    </span>
                  </div>
                  <div className={style.tableFeildValue}>
                    {formData.adharNumber}
                  </div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>DOB</span>
                  </div>
                  <div className={style.tableFeildValue}>{formData.dob}</div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>Email</span>
                  </div>
                  <div className={style.tableFeildValue}>{formData.email}</div>
                </div>

                <div className={style.tableFeildWrapper}>
                  <div className={style.tableFeildName}>
                    <span className={style.tableFeildHeadingName}>
                      Phone Number
                    </span>
                  </div>
                  <div className={style.tableFeildValue}>
                    {formData.phoneNumber}
                  </div>
                </div>

                <div className={style.selectedProductWrapper}>
                  <div className={style.tableSelectedProdctHeading}>
                    <span className={style.tableFeildHeadingName}>
                      Selected Products :
                    </span>
                  </div>
                  <div className={style.tableSelectedProductWrapper}>
                    <ul>
                      {formData.products.map((product) => (
                        <li className={style.productListItem}>{product}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className={style.buttonNavigation}>
                <div className={style.buttonWrapper}>
                  <button
                    className={style.saveDraftButton}
                    onClick={handleSaveAsDraft}
                  >
                    Save Draft
                  </button>
                  <button
                    className={style.submitButton}
                    onClick={handleApplicationSubmit}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {asideClick === "dashboard" && (
          <>
            {isLoading === true ? (
              <Spinners />
            ) : (
              <>
                {user.isOperationalManager === true ? (
                  <>
                    <div className={style.dashboardContainer}>
                      <div className={style.dashboardCart}>
                        <div className={style.dashBoardStateWrapper}>
                          <div className={style.formStatusHeading}>
                            <span className={style.statusHeadingText}>
                              Pending
                            </span>
                          </div>
                          <div className={style.formStatusCount}>
                            <span className={style.statusHeadingCount}>
                              {fetchSubmitedData.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={style.cartResult}>
                        {fetchSubmitedData.map((singleApplication) => (
                          <>
                            <div className={style.appBarContainer}>
                              <div className={style.appBarInfoWrapper}>
                                <div className={style.applicationBarInfo}>
                                  <span className={style.barInfoHeading}>
                                    Relationship Manager Name :
                                  </span>
                                  <span className={style.barInfoResult}>
                                    {singleApplication.relationshipManagerName}
                                  </span>
                                </div>
                                <div className={style.applicationBarInfo}>
                                  <span className={style.barInfoHeading}>
                                    Customer Name :
                                  </span>
                                  <span className={style.barInfoResult}>
                                    {singleApplication.customerName}
                                  </span>
                                </div>
                                <div className={style.applicationBarInfo}>
                                  <span className={style.barInfoHeading}>
                                    Status :
                                  </span>
                                  <span className={style.barInfoResult}>
                                    {singleApplication.applicationRequest}
                                  </span>
                                </div>
                              </div>
                              <div className={style.appBarButtonWrapper}>
                                <button
                                  className={style.appBarViewButton}
                                  onClick={() =>
                                    handleViewApplication(singleApplication)
                                  }
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={style.dashboardContainer}>
                      <div className={style.dashboardCart}>
                        <div
                          className={style.dashBoardStateWrapper}
                          onClick={() => {
                            setDashboardSelection("drafted");
                          }}
                        >
                          <div className={style.formStatusHeading}>
                            <span className={style.statusHeadingText}>
                              Drafts
                            </span>
                          </div>
                          <div className={style.formStatusCount}>
                            <span className={style.statusHeadingCount}>
                              {fetchDraftedData.length}
                            </span>
                          </div>
                        </div>

                        <div
                          className={style.dashBoardStateWrapper}
                          onClick={() => {
                            setDashboardSelection("submited");
                          }}
                        >
                          <div className={style.formStatusHeading}>
                            <span className={style.statusHeadingText}>
                              Submited
                            </span>
                          </div>
                          <div className={style.formStatusCount}>
                            <span className={style.statusHeadingCount}>
                              {fetchSubmitedData.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={style.cartResult}>
                        {dashBoardSelection === "drafted" && (
                          <>
                            {fetchDraftedData.map((singleApplication) => (
                              <>
                                <div className={style.appBarContainer}>
                                  <div className={style.appBarInfoWrapper}>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Relationship Manager Name :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {
                                          singleApplication.relationshipManagerName
                                        }
                                      </span>
                                    </div>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Customer Name :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {singleApplication.customerName}
                                      </span>
                                    </div>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Status :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {singleApplication.applicationRequest}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={style.appBarButtonWrapper}>
                                    <button
                                      className={style.appBarViewButton}
                                      onClick={() => {
                                        handleViewApplication(
                                          singleApplication
                                        );
                                      }}
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              </>
                            ))}
                          </>
                        )}
                        {dashBoardSelection === "submited" && (
                          <>
                            {fetchSubmitedData.map((singleApplication) => (
                              <>
                                <div className={style.appBarContainer}>
                                  <div className={style.appBarInfoWrapper}>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Relationship Manager Name :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {
                                          singleApplication.relationshipManagerName
                                        }
                                      </span>
                                    </div>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Customer Name :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {singleApplication.customerName}
                                      </span>
                                    </div>
                                    <div className={style.applicationBarInfo}>
                                      <span className={style.barInfoHeading}>
                                        Status :
                                      </span>
                                      <span className={style.barInfoResult}>
                                        {singleApplication.applicationRequest}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={style.appBarButtonWrapper}>
                                    <button
                                      className={style.appBarViewButton}
                                      onClick={() =>
                                        handleViewApplication(singleApplication)
                                      }
                                    >
                                      View
                                    </button>
                                  </div>
                                </div>
                              </>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      {viewApplication && (
        <>
          <div className={style.viewApplicationContainer}>
            <div className={style.viewApplicationTable}>
              <div className={style.viewApplicationHeading}>
                <div className={style.summaryTableWrapper}>
                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>
                        Relationship Manager Name
                      </span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.relationshipManagerName}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>
                        Customer Name
                      </span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.customerName}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>
                        Address
                      </span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.address}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>PAN</span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.pan}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>
                        Adhar Number
                      </span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.adharNumber}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>DOB</span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.dob}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>Email</span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.email}
                    </div>
                  </div>

                  <div className={style.tableFeildWrapper}>
                    <div className={style.tableFeildName}>
                      <span className={style.tableFeildHeadingName}>
                        Phone Number
                      </span>
                    </div>
                    <div className={style.tableFeildValue}>
                      {viewApplicationData.phoneNumber}
                    </div>
                  </div>

                  <div className={style.selectedProductWrapper}>
                    <div className={style.tableSelectedProdctHeading}>
                      <span className={style.tableFeildHeadingName}>
                        Selected Products :
                      </span>
                    </div>
                    <div className={style.tableSelectedProductWrapper}>
                      <ul>
                        {viewApplicationData.products.map((product) => (
                          <li className={style.productListItem}>{product}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.viewApplicationBottom}>
                {user.isOperationalManager && (
                  <button
                    className={style.acceptApplicationButton}
                    onClick={() =>
                      handleApplicationResponse(
                        "Accept",
                        viewApplicationData._id
                      )
                    }
                  >
                    Accept
                  </button>
                )}
                {user.isOperationalManager && (
                  <button
                    className={style.rejectApplicationButton}
                    onClick={() =>
                      handleApplicationResponse(
                        "Reject",
                        viewApplicationData._id
                      )
                    }
                  >
                    Reject
                  </button>
                )}

                <button
                  className={style.closeAppButton}
                  onClick={() => setViewApplication(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default MainContainer;
