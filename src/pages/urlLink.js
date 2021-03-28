/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */

// url local efath
var url_alsintanlinkLocal = "https://alsintanlink.com";
var url_alsintanlinkProduction =
  'http://alsintanlink-api.litbang.pertanian.go.id/';

// Authentikasi
var url_login = url_alsintanlinkProduction +  '/api/upja/login';
var url_forgetPassword = url_alsintanlinkProduction +  '/api/upja/forget_password';
var url_registarsiUpja = url_alsintanlinkProduction +  '/api/upja/register';
var url_resendOTP = url_alsintanlinkProduction +  '/api/upja/resend_otp';
var url_submitOTP = url_alsintanlinkProduction +  '/api/upja/submit_otp';

// Main UPJA
var url_showDetailUPJA = url_alsintanlinkProduction +  '/api/upja/show_detail_upja';
var url_getProvince = url_alsintanlinkProduction +  '/api/location/province';
var url_getCity = url_alsintanlinkProduction +  '/api/location/city';
var url_getDistrict = url_alsintanlinkProduction +  '/api/location/district';
var url_getVillage = url_alsintanlinkProduction +  '/api/location/village';
var url_updateUpja = url_alsintanlinkProduction +  '/api/upja/update_upja';
var url_getAllAlsin = url_alsintanlinkProduction +  '/api/upja/show_all_alsin';
var url_getAllAlsinDetail =
  url_alsintanlinkProduction +  '/api/upja/show_detail_alsin';
var url_insertAlsin = url_alsintanlinkProduction +  '/api/upja/insert_alsin';
var url_deleteAlsin = url_alsintanlinkProduction +  '/api/upja/delete_alsin';
var url_updateAlsin = url_alsintanlinkProduction +  '/api/upja/update_alsin';
var url_deleteAlsinItem = url_alsintanlinkProduction +  '/api/upja/delete_alsin_item';
var url_updateAlsinItem = url_alsintanlinkProduction +  '/api/upja/update_alsin_item';
var url_allAlsinType = url_alsintanlinkProduction +  '/api/upja/show_all_alsin_type';
var url_getTransaksi = url_alsintanlinkProduction +  '/api/upja/show_all_transaction';
var url_getTransaksiDetail =
  url_alsintanlinkProduction +  '/api/upja/show_detail_transaction';
var url_showFormPricing = url_alsintanlinkProduction +  '/api/upja/show_form_pricing';
var url_showFormPricingDetail =
  url_alsintanlinkProduction +  '/api/upja/show_alsin_item_available';
var url_updateTransaksi =
  url_alsintanlinkProduction +  '/api/upja/update_status_transaction';

var url_showAllSparePart =
  url_alsintanlinkProduction +  '/api/upja/show_spare_part_upja';
var url_deleteSparePart =
  url_alsintanlinkProduction +  '/api/upja/delete_spare_part_upja';

var url_showAlsinSparePart =
  url_alsintanlinkProduction +  '/api/spare_part/show_alsin_type';
var url_showAlsinTypeSparePart =
  url_alsintanlinkProduction +  '/api/spare_part/show_spare_part_type';
var url_showSparePartParam =
  url_alsintanlinkProduction +  '/api/spare_part/show_spare_part';

var url_insertSukuCadang =
  url_alsintanlinkProduction +  '/api/upja/insert_spare_part_upja';


export {
  url_resendOTP,
  url_submitOTP,
  url_getProvince,
  url_getCity,
  url_forgetPassword,
  url_getDistrict,
  url_getVillage,
  url_registarsiUpja,
  url_showDetailUPJA,
  url_updateUpja,
  url_updateAlsin,
  url_allAlsinType,
  url_login,
  url_getAllAlsin,
  url_getAllAlsinDetail,
  url_insertAlsin,
  url_deleteAlsin,
  url_deleteAlsinItem,
  url_updateAlsinItem,
  url_getTransaksi,
  url_getTransaksiDetail,
  url_showFormPricing,
  url_showFormPricingDetail,
  url_updateTransaksi,
  url_showAllSparePart,
  url_deleteSparePart,
  url_showAlsinSparePart,
  url_showAlsinTypeSparePart,
  url_showSparePartParam,
  url_insertSukuCadang
};
