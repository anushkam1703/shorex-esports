package com.shorex.controller;

import org.springframework.web.bind.annotation.*;

import com.shorex.entity.Contact;
import com.shorex.service.ContactService;

@RestController
@RequestMapping("/api/contact")

public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public Contact saveContact(@RequestBody Contact contact) {
        return contactService.saveContact(contact);
    }
}