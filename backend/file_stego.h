#ifndef FILE_STEGO_H
#define FILE_STEGO_H

#include <iostream>
#include <string>
#include <vector>
#include <cstring>
#include <algorithm>

using namespace std;

// Carrier type enum
enum CarrierType {
    CARRIER_IMAGE,    // PNG, JPG, BMP, GIF
    CARRIER_PDF,      // PDF
    CARRIER_VIDEO,    // MP4, AVI, MKV, MOV, WEBM
    CARRIER_AUDIO,    // MP3, WAV, FLAC, OGG, AAC
    CARRIER_OFFICE,   // DOCX, XLSX, PPTX, DOC, XLS
    CARRIER_TEXT,     // TXT, CSV, LOG, MD
    CARRIER_UNKNOWN
};

class FileStego {
private:
    // 32-byte magic marker to separate original carrier from hidden data
    // "STEGOVAULT_MAGIC_MARKER_2026!!\x00\x01"
    static const int MARKER_SIZE = 32;
    const unsigned char MAGIC_MARKER[32] = {
        0x53, 0x54, 0x45, 0x47, 0x4F, 0x56, 0x41, 0x55,  // STEGOVAU
        0x4C, 0x54, 0x5F, 0x4D, 0x41, 0x47, 0x49, 0x43,  // LT_MAGIC
        0x5F, 0x4D, 0x41, 0x52, 0x4B, 0x45, 0x52, 0x5F,  // _MARKER_
        0x32, 0x30, 0x32, 0x36, 0x21, 0x21, 0x00, 0x01   // 2026!!\0\1
    };

    // XOR obfuscation with a rotating key derived from carrier size
    string xorObfuscate(const string& data, size_t carrierSize) {
        // Generate a pseudo-random key from the carrier size
        unsigned char key[16];
        size_t seed = carrierSize;
        for (int i = 0; i < 16; i++) {
            seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF; // LCG
            key[i] = (unsigned char)(seed & 0xFF);
        }

        string result = data;
        for (size_t i = 0; i < result.size(); i++) {
            result[i] = result[i] ^ key[i % 16];
        }
        return result;
    }

    // Convert string to zero-width Unicode encoding
    // '0' bit -> U+200B (Zero-Width Space)       = 0xE2 0x80 0x8B in UTF-8
    // '1' bit -> U+200C (Zero-Width Non-Joiner)   = 0xE2 0x80 0x8C in UTF-8
    string bitsToZeroWidth(const string& bits) {
        string result;
        result.reserve(bits.size() * 3); // each zero-width char = 3 UTF-8 bytes
        for (char b : bits) {
            result += '\xE2';
            result += '\x80';
            if (b == '0') {
                result += '\x8B'; // U+200B
            } else {
                result += '\x8C'; // U+200C
            }
        }
        return result;
    }

    // Decode zero-width Unicode characters back to bits
    string zeroWidthToBits(const string& encoded) {
        string bits;
        for (size_t i = 0; i + 2 < encoded.size(); i++) {
            if ((unsigned char)encoded[i] == 0xE2 && (unsigned char)encoded[i+1] == 0x80) {
                if ((unsigned char)encoded[i+2] == 0x8B) {
                    bits += '0';
                    i += 2;
                } else if ((unsigned char)encoded[i+2] == 0x8C) {
                    bits += '1';
                    i += 2;
                }
            }
        }
        return bits;
    }

    // Convert raw bytes to a binary string (each byte -> "01100110")
    string bytesToBits(const string& data) {
        string bits;
        bits.reserve(data.size() * 8);
        for (unsigned char c : data) {
            for (int i = 7; i >= 0; i--) {
                bits += ((c >> i) & 1) ? '1' : '0';
            }
        }
        return bits;
    }

    // Convert binary string back to bytes
    string bitsToBytes(const string& bits) {
        string result;
        for (size_t i = 0; i + 7 < bits.size(); i += 8) {
            unsigned char byte = 0;
            for (int j = 0; j < 8; j++) {
                byte = (byte << 1) | (bits[i+j] - '0');
            }
            result += (char)byte;
        }
        return result;
    }

    // Write a 64-bit integer as 8 little-endian bytes
    string sizeToBytes(uint64_t size) {
        string result(8, '\0');
        for (int i = 0; i < 8; i++) {
            result[i] = (char)(size & 0xFF);
            size >>= 8;
        }
        return result;
    }

    // Read a 64-bit integer from 8 little-endian bytes
    uint64_t bytesToSize(const string& data, size_t offset) {
        uint64_t result = 0;
        for (int i = 7; i >= 0; i--) {
            result = (result << 8) | (unsigned char)data[offset + i];
        }
        return result;
    }

    // Get file extension in lowercase
    string getExtension(const string& filename) {
        size_t dot = filename.rfind('.');
        if (dot == string::npos) return "";
        string ext = filename.substr(dot + 1);
        transform(ext.begin(), ext.end(), ext.begin(), ::tolower);
        return ext;
    }

public:

    // ========== CARRIER TYPE DETECTION ==========
    CarrierType detectType(const string& filename) {
        string ext = getExtension(filename);

        if (ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "webp")
            return CARRIER_IMAGE;
        if (ext == "pdf")
            return CARRIER_PDF;
        if (ext == "mp4" || ext == "avi" || ext == "mkv" || ext == "mov" || ext == "webm" || ext == "flv" || ext == "wmv")
            return CARRIER_VIDEO;
        if (ext == "mp3" || ext == "wav" || ext == "flac" || ext == "ogg" || ext == "aac" || ext == "wma" || ext == "m4a")
            return CARRIER_AUDIO;
        if (ext == "docx" || ext == "xlsx" || ext == "pptx" || ext == "doc" || ext == "xls" || ext == "ppt" || ext == "odt" || ext == "ods")
            return CARRIER_OFFICE;
        if (ext == "txt" || ext == "csv" || ext == "log" || ext == "md" || ext == "json" || ext == "xml" || ext == "html" || ext == "css" || ext == "js")
            return CARRIER_TEXT;

        return CARRIER_UNKNOWN;
    }

    // Return the carrier type as a human-readable string
    string carrierTypeName(CarrierType type) {
        switch (type) {
            case CARRIER_IMAGE:   return "image";
            case CARRIER_PDF:     return "pdf";
            case CARRIER_VIDEO:   return "video";
            case CARRIER_AUDIO:   return "audio";
            case CARRIER_OFFICE:  return "office";
            case CARRIER_TEXT:    return "text";
            default:              return "unknown";
        }
    }

    // Get the MIME type for carrier download
    string getMimeType(const string& filename) {
        string ext = getExtension(filename);
        if (ext == "png") return "image/png";
        if (ext == "jpg" || ext == "jpeg") return "image/jpeg";
        if (ext == "gif") return "image/gif";
        if (ext == "bmp") return "image/bmp";
        if (ext == "webp") return "image/webp";
        if (ext == "pdf") return "application/pdf";
        if (ext == "mp4") return "video/mp4";
        if (ext == "avi") return "video/x-msvideo";
        if (ext == "mkv") return "video/x-matroska";
        if (ext == "mov") return "video/quicktime";
        if (ext == "webm") return "video/webm";
        if (ext == "mp3") return "audio/mpeg";
        if (ext == "wav") return "audio/wav";
        if (ext == "flac") return "audio/flac";
        if (ext == "ogg") return "audio/ogg";
        if (ext == "aac") return "audio/aac";
        if (ext == "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (ext == "xlsx") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (ext == "pptx") return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        if (ext == "doc") return "application/msword";
        if (ext == "xls") return "application/vnd.ms-excel";
        if (ext == "txt" || ext == "csv" || ext == "log" || ext == "md") return "text/plain";
        if (ext == "json") return "application/json";
        if (ext == "xml") return "application/xml";
        if (ext == "html") return "text/html";
        return "application/octet-stream";
    }


    // ========== BINARY FILE STEGANOGRAPHY ==========
    // Hides data by appending XOR-obfuscated payload after the carrier's natural end.
    // Format: [original carrier][MAGIC_MARKER][XOR-encrypted payload][payload_size 8 bytes]
    
    string embedInBinary(const string& carrierData, const string& payload) {
        size_t originalSize = carrierData.size();
        
        // XOR-obfuscate the payload using the carrier size as key seed
        string encrypted = xorObfuscate(payload, originalSize);
        
        // Build the stego file: carrier + marker + encrypted + size
        string result;
        result.reserve(originalSize + MARKER_SIZE + encrypted.size() + 8);
        
        result += carrierData;                                            // Original file
        result.append((char*)MAGIC_MARKER, MARKER_SIZE);                  // 32-byte magic marker
        result += encrypted;                                              // XOR-encrypted payload
        result += sizeToBytes((uint64_t)payload.size());                  // 8-byte payload size
        
        return result;
    }

    string extractFromBinary(const string& carrierData) {
        if (carrierData.size() < MARKER_SIZE + 8) return "";
        
        // Read the payload size from the last 8 bytes
        uint64_t payloadSize = bytesToSize(carrierData, carrierData.size() - 8);
        
        // Validate: total should be at least marker + payload + size
        if (carrierData.size() < MARKER_SIZE + payloadSize + 8) return "";
        
        // Find where the marker starts
        size_t markerPos = carrierData.size() - 8 - payloadSize - MARKER_SIZE;
        
        // Verify the magic marker is present
        if (memcmp(carrierData.data() + markerPos, MAGIC_MARKER, MARKER_SIZE) != 0) {
            return ""; // No hidden data found
        }
        
        // Extract the encrypted payload
        string encrypted = carrierData.substr(markerPos + MARKER_SIZE, payloadSize);
        
        // The original carrier size was everything before the marker
        size_t originalSize = markerPos;
        
        // De-XOR with the same key (carrier size)
        string payload = xorObfuscate(encrypted, originalSize);
        
        return payload;
    }


    // ========== TEXT FILE STEGANOGRAPHY ==========
    // Hides data using zero-width Unicode characters between visible characters.
    // Each bit of payload maps to an invisible Unicode character.

    string embedInText(const string& textData, const string& payload) {
        // Convert payload to binary
        string bits = bytesToBits(payload);
        
        // We need enough visible characters to insert zero-width chars between them
        // Available insertion points = textData.size() - 1 (between each pair of chars)
        // But we can also insert multiple zero-width chars at one point
        
        // Strategy: Insert all zero-width chars at the BEGINNING of the text,
        // wrapped between two invisible markers
        string startMarker;
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8B'; // U+200B
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8C'; // U+200C
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8B'; // U+200B
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8C'; // U+200C
        
        string endMarker;
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8C'; // U+200C
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8B'; // U+200B
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8C'; // U+200C
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8B'; // U+200B
        
        string zeroWidthData = bitsToZeroWidth(bits);
        
        // Insert the hidden data block right after the first character
        string result;
        if (textData.size() > 0) {
            result += textData[0];
            result += startMarker;
            result += zeroWidthData;
            result += endMarker;
            result += textData.substr(1);
        } else {
            result = startMarker + zeroWidthData + endMarker;
        }
        
        return result;
    }

    string extractFromText(const string& textData) {
        // Look for the start marker pattern: U+200B U+200C U+200B U+200C
        string startMarker;
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8B';
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8C';
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8B';
        startMarker += '\xE2'; startMarker += '\x80'; startMarker += '\x8C';
        
        string endMarker;
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8C';
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8B';
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8C';
        endMarker += '\xE2'; endMarker += '\x80'; endMarker += '\x8B';
        
        size_t startPos = textData.find(startMarker);
        if (startPos == string::npos) return "";
        
        size_t dataStart = startPos + startMarker.size();
        size_t endPos = textData.find(endMarker, dataStart);
        if (endPos == string::npos) return "";
        
        string zeroWidthBlock = textData.substr(dataStart, endPos - dataStart);
        string bits = zeroWidthToBits(zeroWidthBlock);
        string payload = bitsToBytes(bits);
        
        return payload;
    }
};

#endif
