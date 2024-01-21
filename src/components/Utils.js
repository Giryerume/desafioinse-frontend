export function serialize(obj) {
  var str = [];
  for (var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

export function nomeArea(obj) {
  if (obj === 1) {
    return "Capital";
  } else {
    return "Interior";
  }
}

export function nomeLocalizacao(obj) {
  if (obj === 1) {
    return "Urbana";
  } else {
    return "Rural";
  }
}

export function nomeDependencia(obj) {
  if (obj === 1) {
    return "Federal";
  } else if (obj === 1) {
    return "Estadual";
  } else {
    return "Municipal";
  }
}
