import React from "react";
import "./style-starter.css"
function BreadCrumps(props) {
  return (
    <div>
      <section class="w3l-breadcrumb">
        {props.page === "Stu" && (
          <div class="breadcrumb-bg breadcrumb-bg-about py-5">
          <div class="container pt-lg-5 pt-3 p-lg-4 pb-3" >
            <h2 class="mt-5 pt-lg-5 pt-sm-3">{props.title}</h2>
            <ul class="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
            </ul>
          </div>
        </div>
        )}
        {props.page === "Par" && (
          <div class="breadcrumb-bg breadcrumb-bg-parent py-5">
          <div class="container pt-lg-5 pt-3 p-lg-4 pb-3">
            <h2 class="mt-5 pt-lg-5 pt-sm-3">{props.title}</h2>
            <ul class="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
            </ul>
          </div>
        </div>
        )}
        {props.page === "Tea" && (
          <div class="breadcrumb-bg breadcrumb-bg-teacher py-5">
          <div class="container pt-lg-5 pt-3 p-lg-4 pb-3">
            <h2 class="mt-5 pt-lg-5 pt-sm-3">{props.title}</h2>
            <ul class="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
            </ul>
          </div>
        </div>
        )}
        {props.page === "Pri" && (
          <div class="breadcrumb-bg breadcrumb-bg-principal py-5">
          <div class="container pt-lg-5 pt-3 p-lg-4 pb-3">
            <h2 class="mt-5 pt-lg-5 pt-sm-3">{props.title}</h2>
            <ul class="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
            </ul>
          </div>
        </div>
        )}
        
      </section>
      {/* //about breadcrumb */}
    </div>
  );
}

export default BreadCrumps;
