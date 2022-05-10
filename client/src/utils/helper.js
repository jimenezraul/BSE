// get a current link and if is http replace with https
const getLink = (link) => {
    if (link.includes("http")) {
        return link.replace("http", "https");
    }
    return link;
}

module.exports = {
    getLink
}