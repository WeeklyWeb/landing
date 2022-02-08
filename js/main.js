jQuery(document).ready(function() {
    jQuery('a[href^="#"]').click(function() { var elementClick = jQuery(this).attr("href"); var destination = jQuery(elementClick).offset().top;
        jQuery("html:not(:animated), body:not(:animated)").animate({ scrollTop: destination }, 800); return false; })
    jQuery('.reviews').slick({ dots: false, infinite: true, speed: 500, fade: false, cssEase: 'linear', adaptiveHeight: true });
});
let buttonSubmit = document.querySelector('.button-submit');
let textInput = document.querySelector('input[name="name"]');
let phoneInput = document.querySelector('input[name="phone"]');
const form = document.querySelector('form');
var count = 0;
phoneInput.addEventListener('change', (event) => {
    console.log('change')
    console.log(event.target.value)
})
form.addEventListener('sumbit', (event) => { if (!textInput.length || phoneInput.value.length !== 10) { event.preventDefault(); } })