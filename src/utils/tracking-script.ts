export const generateTrackingScript = (pk?: string) => {
  return `<script>
  (function () {
    var w = window;
    var swan = (w.swan = w.swan || []);
    if (swan.isLoaded) return;
    swan.isLoaded = true;
    swan.pk = '${pk}';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://script.getswan.com?pk=${pk}';
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  })();
</script>`
}
