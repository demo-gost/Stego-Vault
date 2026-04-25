#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#endif

#include "httplib.h"
#include "stego.h"
#include "file_stego.h"
#include <iostream>
#include <bitset>

int main() {
    httplib::Server svr;

    // Allow large file uploads (50MB carrier + 10MB secret)
    svr.set_payload_max_length(60 * 1024 * 1024); // 60 MB

    // --- CORS Preflight ---
    svr.Options("/(.*)", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_header("Access-Control-Expose-Headers", "X-Filename, X-Carrier-Type, X-Carrier-Name");
        res.set_content("", "text/html");
    });

    // --- HEALTH CHECK ---
    svr.Get("/health", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    // ========================================================
    //  UNIVERSAL ENCODE — Hide ANY data inside ANY file
    // ========================================================
    svr.Post("/encode", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Expose-Headers", "X-Filename, X-Carrier-Type, X-Carrier-Name");

        if (!req.has_file("carrier")) {
            res.status = 400;
            res.set_content("{\"error\":\"No carrier file uploaded\"}", "application/json");
            return;
        }

        auto carrier_file = req.get_file_value("carrier");
        std::string carrier_filename = carrier_file.filename;
        std::string carrier_data = carrier_file.content;

        // Build the secret payload
        std::string secret_filename = "secret.txt";
        std::string secret_content = "";

        if (req.has_file("secret_file")) {
            auto sf = req.get_file_value("secret_file");
            secret_filename = sf.filename;
            secret_content = sf.content;
        } else if (req.has_file("secret_text")) {
            secret_content = req.get_file_value("secret_text").content;
        }

        // Create the structured payload: filename:::SEP:::content
        std::string payload = secret_filename + ":::SEP:::" + secret_content;

        // Detect carrier type
        FileStego fs;
        CarrierType ctype = fs.detectType(carrier_filename);
        std::string resultData = "";

        std::cout << "[ENCODE] Carrier: " << carrier_filename 
                  << " (" << fs.carrierTypeName(ctype) << ")"
                  << " | Secret: " << secret_filename 
                  << " | Payload size: " << payload.size() << " bytes" << std::endl;

        if (ctype == CARRIER_IMAGE) {
            // ===== IMAGE: Use LSB + Spiral Traversal =====
            std::string fullPayload = payload + ":::STEGO_END:::";
            std::string binaryMsg = "";
            for (unsigned char c : fullPayload) {
                binaryMsg += std::bitset<8>(c).to_string();
            }

            Stego stego;
            resultData = stego.embedData(carrier_data, binaryMsg);

            if (resultData.empty()) {
                res.status = 500;
                res.set_content("{\"error\":\"Image too small for this payload\"}", "application/json");
                return;
            }
        } 
        else if (ctype == CARRIER_TEXT) {
            // ===== TEXT: Zero-width Unicode steganography =====
            resultData = fs.embedInText(carrier_data, payload);
        }
        else {
            // ===== PDF / VIDEO / AUDIO / OFFICE / UNKNOWN: Binary append =====
            resultData = fs.embedInBinary(carrier_data, payload);
        }

        std::string mimeType = fs.getMimeType(carrier_filename);
        res.set_header("X-Carrier-Type", fs.carrierTypeName(ctype));
        res.set_header("X-Carrier-Name", carrier_filename);
        res.set_content(resultData, mimeType);

        std::cout << "[ENCODE] Success! Output size: " << resultData.size() << " bytes" << std::endl;
    });

    // ========================================================
    //  UNIVERSAL DECODE — Extract hidden data from ANY file
    // ========================================================
    svr.Post("/decode", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Expose-Headers", "X-Filename, X-Carrier-Type");

        if (!req.has_file("carrier")) {
            res.status = 400;
            res.set_content("{\"error\":\"No carrier file uploaded\"}", "application/json");
            return;
        }

        auto carrier_file = req.get_file_value("carrier");
        std::string carrier_filename = carrier_file.filename;
        std::string carrier_data = carrier_file.content;

        FileStego fs;
        CarrierType ctype = fs.detectType(carrier_filename);
        std::string extractedPayload = "";

        std::cout << "[DECODE] Carrier: " << carrier_filename 
                  << " (" << fs.carrierTypeName(ctype) << ")" << std::endl;

        if (ctype == CARRIER_IMAGE) {
            // ===== IMAGE: LSB extraction =====
            Stego stego;
            extractedPayload = stego.extractData(carrier_data);
        } 
        else if (ctype == CARRIER_TEXT) {
            // ===== TEXT: Zero-width Unicode extraction =====
            extractedPayload = fs.extractFromText(carrier_data);
        }
        else {
            // ===== PDF / VIDEO / AUDIO / OFFICE: Binary extract =====
            extractedPayload = fs.extractFromBinary(carrier_data);
        }

        if (extractedPayload.empty()) {
            res.status = 404;
            res.set_content("{\"error\":\"No hidden data found in this file\"}", "application/json");
            return;
        }

        // Unpack the payload: filename:::SEP:::content
        size_t sepPos = extractedPayload.find(":::SEP:::");
        if (sepPos != std::string::npos) {
            std::string filename = extractedPayload.substr(0, sepPos);
            std::string content = extractedPayload.substr(sepPos + 9);

            res.set_header("X-Filename", filename);
            res.set_header("X-Carrier-Type", fs.carrierTypeName(ctype));
            res.set_content(content, "application/octet-stream");

            std::cout << "[DECODE] Success! Extracted: " << filename 
                      << " (" << content.size() << " bytes)" << std::endl;
        } else {
            res.status = 500;
            res.set_content("{\"error\":\"Data corrupted or format mismatch\"}", "application/json");
        }
    });

    std::cout << "============================================" << std::endl;
    std::cout << "  Stego-Vault Universal Edition" << std::endl;
    std::cout << "  Supports: Image | PDF | Video | Audio | Office | Text" << std::endl;
    std::cout << "  Server running at http://localhost:8080" << std::endl;
    std::cout << "============================================" << std::endl;
    svr.listen("0.0.0.0", 8080);
}