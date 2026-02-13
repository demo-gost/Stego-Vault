#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION

#include "httplib.h"
#include "huffman.h"
#include "stego.h"
#include <iostream>
#include <vector>
#include <bitset>

// Helper: Convert Binary String back to Text
std::string binaryToText(std::string binary) {
    std::string text = "";
    for (size_t i = 0; i < binary.length(); i += 8) {
        if (i + 8 > binary.length()) break;
        std::string byteStr = binary.substr(i, 8);
        char ch = (char)std::bitset<8>(byteStr).to_ulong();
        text += ch;
    }
    return text;
}

int main() {
    httplib::Server svr;

    svr.Options("/(.*)", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_content("", "text/html");
    });

    // --- ENCODE (LOCK) ---
    svr.Post("/encode", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        if (req.has_file("image") && req.has_file("secret")) {
            
            // 1. Get Data from RAM (No saving to disk)
            auto image_file = req.get_file_value("image");
            auto secret_file = req.get_file_value("secret");

            // 2. Convert Message to Binary
            std::string binaryMsg = "";
            for (char c : secret_file.content) {
                binaryMsg += std::bitset<8>(c).to_string();
            }

            // 3. Process in RAM
            Stego stego;
            // Pass the image content directly!
            std::string resultImageData = stego.embedData(image_file.content, binaryMsg);

            if (!resultImageData.empty()) {
                // 4. Send back the Result (Directly from RAM)
                res.set_content(resultImageData, "image/png");
                std::cout << "Success: Encoded without disk storage." << std::endl;
            } else {
                res.status = 500;
                res.set_content("Error processing image", "text/plain");
            }
        }
    });

    // --- DECODE (UNLOCK) ---
    svr.Post("/decode", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        
        if (req.has_file("image")) {
            // 1. Get Data from RAM
            auto image_file = req.get_file_value("image");

            // 2. Extract Bits
            Stego stego;
            std::string extractedBits = stego.extractData(image_file.content);
            
            // 3. Convert to Text
            std::string hiddenText = binaryToText(extractedBits);
            
            std::cout << "Decoded: " << hiddenText << std::endl;
            res.set_content(hiddenText, "text/plain");
        }
    });

    std::cout << "Stego-Vault (In-Memory Version) started at http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
}